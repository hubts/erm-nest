import { MongooseConfig } from "./mongoose.config";
import { ServerConfig, ServerEnv } from "./server.config";

// 환경변수 로드용 배열
export const CONFIGURATIONS = [ServerConfig, MongooseConfig];

/**
 * Configuration 총괄 인터페이스
 */
export type Configuration = {
    Server: {
        env: ServerEnv;
        host: string;
        port: number;
        isProduction: boolean;
    };
    Mongoose: {
        uri: string;
    };
};
