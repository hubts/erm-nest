import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpStatus,
    Logger,
} from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";
import { Request } from "express";

/**
 * Used in microservices
 */

@Catch()
export class RpcErrorFilter implements ExceptionFilter {
    constructor(private readonly logger: Logger) {}

    catch(error: Error | RpcException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const request = ctx.getRequest<Request>();

        if (error instanceof RpcException) {
            this.logger.error(
                JSON.stringify(
                    {
                        error: error.getError(),
                        request,
                        stack: error.stack,
                    },
                    null,
                    4
                )
            );
            throw error.getError();
        }

        // Error
        this.logger.error(
            JSON.stringify(
                {
                    error: error.message,
                    request,
                    stack: error.stack,
                },
                null,
                4
            )
        );

        // Return
        throw new RpcException({
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            message: error.message,
            stack: error.stack,
        }).getError();
    }
}
