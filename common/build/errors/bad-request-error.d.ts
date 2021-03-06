import { CustomError } from "./custom-error";
export declare class BadRequestError extends CustomError {
    reason: string;
    statusCode: number;
    constructor(reason?: string);
    serializeErrors(): {
        message: string;
    }[];
}
