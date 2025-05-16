import {
    Injectable,
    CanActivate,
    ExecutionContext,
    UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { UserModel, UserRole } from "@app/sdk";

/**
 * RolesGuard detects the role of outside actor.
 *
 * After JwtAuthGuard, the identifier and role of the actor was extracted.
 * RolesGuard challenges the role has an appropriate permission to execute or access to controller.
 */

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const roles = this.reflector.get<UserRole[]>(
            "roles",
            context.getHandler()
        );
        // If no roles are defined, allow access (but need JWT)
        if (!roles.length) {
            return true;
        }

        /**
         * Inherited roles (if exists)
         */

        /**
         * Check
         */

        const request: Request & {
            user: UserModel;
        } = context.switchToHttp().getRequest();
        const user = request.user;
        if (!user) {
            // This error occurs when JWT was not extracted.
            // However, this guard is called after the extracting.
            // Then, this condition may not be needed.
            throw new UnauthorizedException("Unauthorized");
        }

        // Admin can access all resources
        if (user.role === UserRole.ADMIN) {
            return true;
        }

        /**
         * If this returns false, 403 Forbidden error occurs.
         */
        return roles.some(role => role === user.role);
    }
}
