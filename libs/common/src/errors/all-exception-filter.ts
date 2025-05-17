import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus,
    Logger,
    ServiceUnavailableException,
} from "@nestjs/common";
import { Request, Response } from "express";
import { asErrorResponse } from "../dto";
import { convertRpcException } from "./convert-rpc-exception";

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
    constructor(private readonly logger: Logger) {}

    catch(error: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const request = ctx.getRequest<Request>();
        const response = ctx.getResponse<Response>();
        const path = `${request.method} ${request.url}`;

        this.logger.error(error);

        // Microservice 연결 실패 시 처리
        if ((error as any).code === "ECONNREFUSED") {
            error = new ServiceUnavailableException({
                statusCode: HttpStatus.SERVICE_UNAVAILABLE,
                message: "서비스 연결에 실패하였습니다.",
                cause: error,
            });
        }

        // RPC to HttpException
        const normalizedError = convertRpcException(error);

        const status =
            normalizedError instanceof HttpException
                ? normalizedError.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;
        const message = normalizedError.message;
        const stack = normalizedError.stack;
        const cause = normalizedError.cause;

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
