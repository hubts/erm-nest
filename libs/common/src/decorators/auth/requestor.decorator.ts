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
            throw new UnauthorizedException("Unauthorized user");
        }
        return request.user;
    }
);
