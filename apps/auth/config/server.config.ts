import { registerAs } from "@nestjs/config";
import {
    ConfigValidation,
    NotEmptyIntRange,
    NotEmptyString,
    NotEmptyEnum,
} from "@app/common";
import { Configuration } from "./configuration";
import * as path from "path";

export const ServerConfig = registerAs(
    "server",
    (): Configuration["Server"] => {
        const config = new ServerConfigValidation();
        return {
            env: config.ENV,
            host: config.HOST,
            port: config.PORT,
            isProduction: config.ENV === ServerEnv.PRODUCTION,
            adminSecret: config.ADMIN_SECRET,
            endpoint: {
                external: config.EXTERNAL_ENDPOINT,
                globalPrefix: config.GLOBAL_PREFIX,
            },
            docs: {
                path: config.DOCS_PATH,
                fullPath: path.join(config.GLOBAL_PREFIX, config.DOCS_PATH),
            },
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

    @NotEmptyString()
    GLOBAL_PREFIX: string;

    @NotEmptyString()
    EXTERNAL_ENDPOINT: string;

    @NotEmptyString()
    DOCS_PATH: string;

    @NotEmptyString()
    ADMIN_SECRET: string;
}
