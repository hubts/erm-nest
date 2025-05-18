import { PassportStrategy } from "@nestjs/passport";
import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import { ExtractJwt, Strategy } from "passport-jwt";
import { JwtConfig } from "apps/auth/config/jwt.config";
import { AuthRoute, JwtPayload } from "@app/sdk";
import { AUTH_SERVICE } from "./constants";
import { ClientProxy } from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";

/**
 * Define a validation strategy for 'JwtAuthGuard'.
 *
 * After the validation of JwtAuthGuard,
 *
 * As defined at constructor, JWT is extracted from 'Request'.
 * The token is confirmed by secret(public key), and transformed as payload.
 * Then, the valid user would be found, and returned.
 *
 * @param {JwtPayload} payload - The payload relayed from Hasura server (extracted by).
 * @return {User} The valid user (return is saved at 'user' field of 'Request' as 'request.user').
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @Inject(JwtConfig.KEY)
        jwtConfig: ConfigType<typeof JwtConfig>,
        @Inject(AUTH_SERVICE)
        private readonly authClient: ClientProxy
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: jwtConfig.publicKey,
        });
    }

    async validate(payload: JwtPayload): Promise<JwtPayload> {
        const { id, role } = payload;

        // Check if the payload is valid
        if (!id || !role) {
            throw new UnauthorizedException("올바르지 않은 토큰입니다.");
        }

        // User check
        const user = await firstValueFrom(
            this.authClient.send(AuthRoute.getAuthorizedUser.cmd, [id])
        );
        if (!user) {
            throw new UnauthorizedException("존재하지 않는 유저입니다.");
        }

        return user;
    }
}
