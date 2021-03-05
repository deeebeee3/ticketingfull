import express, { Request, Response } from "express";
import { body } from "express-validator";
import {
  requireAuth,
  validateRequest,
  DatabaseConnectionError,
} from "@ddbtickets/common";
import { Ticket } from "../models/ticket";
import { TicketCreatedPublisher } from "../events/publishers/ticket-created-publisher";
import { natsWrapper } from "../nats-wrapper";

import mongoose from "mongoose";

const router = express.Router();

router.post(
  "/api/tickets",
  requireAuth,
  [
    body("title").not().isEmpty().withMessage("Title is required"),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("Price must be greater than 0"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, price } = req.body;

    const ticket = Ticket.build({
      title,
      price,
      userId: req.currentUser!.id,
    });

    // Start a new Session and Transaction
    const SESSION = await mongoose.startSession();
    SESSION.startTransaction();

    try {
      await ticket.save();

      await new TicketCreatedPublisher(natsWrapper.client).publish({
        id: ticket.id,
        title: ticket.title,
        price: ticket.price,
        userId: ticket.userId,
      });

      //Only commit transaction if TicketCreatedPublisher event successfully published
      await SESSION.commitTransaction();

      res.status(201).send(ticket);
    } catch (err) {
      // Catch any transaction error
      await SESSION.abortTransaction();
      throw new DatabaseConnectionError();
    } finally {
      // Finally end the Session
      SESSION.endSession();
    }
  }
);

export { router as createTicketRouter };
