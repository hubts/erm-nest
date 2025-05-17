import { JwtConfig } from "./jwt.config";
import { ServerConfig, ServerEnv } from "./server.config";

// 환경변수 로드용 배열
export const CONFIGURATIONS = [ServerConfig, JwtConfig];

/**
 * Configuration 총괄 인터페이스
 */
export type Configuration = {
    Server: {
        env: ServerEnv;
        port: number;
        isProduction: boolean;
        adminSecret: string;
        endpoint: {
            external: string;
            globalPrefix: string;
        };
        docs: {
            path: string;
            fullPath: string;
        };
    };
    Jwt: {
        publicKey: string;
    };
};
