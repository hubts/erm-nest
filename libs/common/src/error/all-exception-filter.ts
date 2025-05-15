import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus,
    InternalServerErrorException,
} from "@nestjs/common";
import { Request, Response } from "express";
import { asErrorResponse } from "../dto";

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
    // constructor(private readonly logger: CustomLogger) {}

    catch(error: Error, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const request = ctx.getRequest<Request>();
        const response = ctx.getResponse<Response>();
        const path = `${request.method} ${request.url}`;

        if (!(error instanceof HttpException)) {
            error = new InternalServerErrorException({
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: error.message,
                cause: error,
            });
        }

        const exception = error as HttpException;
        const status = exception.getStatus();
        const message = exception.message;
        const stack = exception.stack;
        const cause = exception.cause;

        // Return
        response.status(status as number).json({
            ...asErrorResponse(message, cause),
            extension: {
                path,
                timestamp: new Date().toISOString(),
                stack,
            },
        });
    }
}
