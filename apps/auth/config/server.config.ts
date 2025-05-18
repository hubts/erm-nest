import { registerAs } from "@nestjs/config";
import {
    ConfigValidation,
    NotEmptyIntRange,
    NotEmptyString,
    NotEmptyEnum,
} from "@app/common";
import { Configuration } from "./configuration";

export const ServerConfig = registerAs(
    "server",
    (): Configuration["Server"] => {
        const config = new ServerConfigValidation();
        return {
            env: config.ENV,
            host: config.HOST,
            port: config.PORT,
            isProduction: config.ENV === ServerEnv.PRODUCTION,
        };
    }
);

// 서버 환경 변수
export const ServerEnv = {
    LOCAL: "local",
    DEVELOPMENT: "development",
    TEST: "test",
    PRODUCTION: "production",
} as const;
export type ServerEnv = (typeof ServerEnv)[keyof typeof ServerEnv];

@ConfigValidation()
class ServerConfigValidation {
    @NotEmptyEnum(ServerEnv)
    ENV: ServerEnv;

    @NotEmptyString()
    HOST: string;

    @NotEmptyIntRange(0, 65535)
    PORT: number;
}
