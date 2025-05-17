import {
    ConfigValidation,
    NotEmptyIntRange,
    NotEmptyString,
} from "@app/common";
import { registerAs } from "@nestjs/config";
import { Configuration } from "../configuration";

export const AuthServiceConfig = registerAs(
    "auth-service",
    (): Configuration["Microservices"]["Auth"] => {
        const config = new AuthServiceConfigValidation();
        return {
            host: config.MS_AUTH_SERVICE_HOST,
            port: config.MS_AUTH_SERVICE_PORT,
        };
    }
);

@ConfigValidation()
class AuthServiceConfigValidation {
    @NotEmptyString()
    MS_AUTH_SERVICE_HOST: string;

    @NotEmptyIntRange(0, 65535)
    MS_AUTH_SERVICE_PORT: number;
}
