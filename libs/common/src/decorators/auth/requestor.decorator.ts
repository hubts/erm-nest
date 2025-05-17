import { UserModel } from "@app/sdk";
import {
    ExecutionContext,
    UnauthorizedException,
    createParamDecorator,
} from "@nestjs/common";

/**
 * Decorator used to specify who is granted access.
 */
export const Requestor = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest() as Request & {
            user?: UserModel;
        };
        if (!request.user) {
            throw new UnauthorizedException(
                "인증된 사용자가 제대로 추출되지 않았습니다."
            );
        }
        return request.user;
    }
);
