import { ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Observable } from "rxjs";

/**
 * JwtAuthGuard detects JWT from the request.
 *
 * This guard extracts the request to process the verification set by JwtStrategy.
 * For example, this guard checks a 'Bearer' token in 'authorization' field of request-header.
 */

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
    canActivate(
        context: ExecutionContext
    ): boolean | Promise<boolean> | Observable<boolean> {
        return super.canActivate(context);
    }
}
