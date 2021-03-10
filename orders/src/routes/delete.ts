import express, { Request, Response } from "express";
import {
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
} from "@ddbtickets/common";
import { Order, OrderStatus } from "../models/order";

const router = express.Router();

router.delete(
  "/api/orders/:orderId",
  requireAuth,
  async (req: Request, res: Response) => {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);

    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    //set status to cancelled
    order.status = OrderStatus.Cancelled;
    await order.save();

    //204 is for successfully delete - we are not really deleting but cancelling an order
    res.status(204).send(order);
  }
);

export { router as deleteOrderRouter };
