import { JwtAuthGuard, RolesGuard } from "@app/common";
import { SetMetadata, UseGuards, applyDecorators } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

/**
 * Decorator sets permissions related to access.
 * @param roles - Roles to allow to access.
 */
const Roles = <R>(...roles: R[]) => SetMetadata("roles", roles);

/**
 * A bundle of decorators that verify user access.
 * @param roles - Roles of the user to allow access.
 */
export function JwtRolesAuth<R>(roles?: R[]) {
    if (roles?.length) {
        return applyDecorators(
            // Set roles metadata
            Roles(...roles),
            // Use guards - JWT authentication and roles
            UseGuards(JwtAuthGuard, RolesGuard),
            // Set bearer authentication in Swagger
            ApiBearerAuth()
        );
    }
    return applyDecorators();
}
