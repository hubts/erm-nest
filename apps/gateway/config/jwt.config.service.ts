import { JwtModuleOptions, JwtOptionsFactory } from "@nestjs/jwt";
import { Inject, Injectable } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import { JwtConfig } from "./jwt.config";
import { Algorithm } from "jsonwebtoken";

@Injectable()
export class JwtConfigService implements JwtOptionsFactory {
    private JWT_ALGORITHM: Algorithm = "RS256";
    private config: ConfigType<typeof JwtConfig>;

    constructor(
        @Inject(JwtConfig.KEY)
        config: ConfigType<typeof JwtConfig>
    ) {
        this.config = config;
    }

    createJwtOptions(): JwtModuleOptions {
        return {
            publicKey: this.config.publicKey,
            verifyOptions: {
                algorithms: [this.JWT_ALGORITHM],
            },
        };
    }
}
