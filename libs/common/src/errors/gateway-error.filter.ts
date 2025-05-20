import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus,
    InternalServerErrorException,
    Logger,
    ServiceUnavailableException,
} from "@nestjs/common";
import { Request, Response } from "express";
import { asErrorResponse } from "../dto";

@Catch()
export class GatewayErrorFilter implements ExceptionFilter {
    constructor(private readonly logger: Logger) {}

    catch(error: Error | HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const request = ctx.getRequest<Request>();
        const response = ctx.getResponse<Response>();
        const path = `${request.method} ${request.url}`;

        // Microservice 연결 실패 시 처리
        if ((error as any).code === "ECONNREFUSED") {
            error = new ServiceUnavailableException({
                statusCode: HttpStatus.SERVICE_UNAVAILABLE,
                message: "서비스 연결에 실패하였습니다.",
                cause: error,
            });
        } else if (!(error instanceof HttpException)) {
            if (
                typeof error === "object" &&
                ("status" in error || "statusCode" in error)
            ) {
                error = new HttpException(
                    error.message,
                    error["status"] || error["statusCode"],
                    {
                        cause: error,
                    }
                );
            } else {
                // Unknown Error will be 500
                error = new InternalServerErrorException(error);
            }
        }
        // Now, error is HttpException
        const normalizedError = error as HttpException;
        const status = normalizedError.getStatus();
        const message = normalizedError.message;
        const stack = normalizedError.stack;
        const cause = normalizedError.cause;

        this.logger.error(
            JSON.stringify({
                status,
                message,
            }),
            stack,
            path
        );

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
