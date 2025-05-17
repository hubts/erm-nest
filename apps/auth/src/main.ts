/* eslint-disable @typescript-eslint/no-var-requires */
import { NestFactory } from "@nestjs/core";
import { AuthModule } from "./auth.module";
import { ServerConfig } from "../config/server.config";
import { Logger } from "@nestjs/common";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";

async function bootstrap() {
    try {
        const appContext = await NestFactory.createApplicationContext(
            AuthModule
        );
        const serverConfig = appContext.get(ServerConfig.KEY);
        const packageJson = require("../../../package.json");
        const applicationName = `${packageJson.name}.Auth`;

        const app = await NestFactory.createMicroservice<MicroserviceOptions>(
            AuthModule,
            {
                abortOnError: true,
                transport: Transport.TCP,
                options: {
                    host: serverConfig.host,
                    port: serverConfig.port,
                },
            }
        );

        // Start log
        const logger = new Logger("Auth");
        let log = `Application [ ${applicationName}:${packageJson.version} ] is successfully started\n`;
        log += `< Information >\n`;
        log += `🌏 Env        : ${serverConfig.env}\n`;
        log += `🌏 Endpoint   : ${serverConfig.host}:${serverConfig.port}\n`;
        logger.log(log);

        /**
         * Start
         */
        await app.listen();
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
bootstrap();
