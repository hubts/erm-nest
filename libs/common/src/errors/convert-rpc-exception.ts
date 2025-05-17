import { RpcException } from "@nestjs/microservices";
import { HttpException, InternalServerErrorException } from "@nestjs/common";

export function convertRpcException(error: unknown): HttpException {
    if (error instanceof RpcException) {
        const payload = error.getError() as {
            statusCode: number;
            message: string;
        };
        return new HttpException(payload.message, payload.statusCode, {
            cause: payload,
        });
    }
    return new InternalServerErrorException(error);
}
