import { CustomError } from "./custom-error";
export declare class NotFoundError extends CustomError {
    reason: string;
    statusCode: number;
    constructor();
    serializeErrors(): {
        message: string;
    }[];
}
