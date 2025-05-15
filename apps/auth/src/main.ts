/* eslint-disable @typescript-eslint/no-var-requires */
import { NestFactory } from "@nestjs/core";
import { AuthModule } from "./auth.module";
import { ServerConfig } from "../config/server.config";
import {
    AllExceptionFilter,
    CommonResponseDto,
    CustomValidationPipe,
    setupSwagger,
} from "@app/common";
import { NestExpressApplication } from "@nestjs/platform-express";
import { SwaggerThemeNameEnum } from "swagger-themes";
import { Logger } from "@nestjs/common";

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AuthModule, {
        abortOnError: true,
    });
    const logger = new Logger("Auth");

    try {
        const serverConfig = app.get(ServerConfig.KEY);
        const packageJson = require("../../../package.json");
        const applicationName = `${packageJson.name}.Auth`;

        // CORS
        app.enableCors({
            allowedHeaders: ["Content-Type", "Authorization"],
            methods: "GET, POST, PUT, PATCH, DELETE",
            credentials: true,
            origin: "*",
        });

        // Swagger
        const swaggerPath = serverConfig.docs.fullPath;
        setupSwagger(app, {
            path: swaggerPath,
            theme: SwaggerThemeNameEnum.FEELING_BLUE,
            serverUrl: new URL(
                serverConfig.endpoint.globalPrefix,
                serverConfig.endpoint.external
            ).toString(),
            title: applicationName,
            version: packageJson.version,
            description: "Documents to experience API",
            extraModels: [CommonResponseDto],
        });

        // Global pipe
        app.useGlobalPipes(new CustomValidationPipe());

        // Global filter
        app.useGlobalFilters(new AllExceptionFilter());

        // API global prefix
        app.setGlobalPrefix(serverConfig.endpoint.globalPrefix);

        /**
         * Start
         */
        await app.listen(serverConfig.port, async () => {
            let log = `Application [ ${applicationName}:${packageJson.version} ] is successfully started\n`;
            log += `< Information >\n`;
            log += `🌏 Env                 : ${serverConfig.env}\n`;
            log += `🌏 Application URL     : ${await app.getUrl()}\n`;
            log += `🌏 External endpoint   : ${new URL(
                serverConfig.endpoint.globalPrefix,
                serverConfig.endpoint.external
            )}\n`;
            log += `🌏 Swagger document    : ${new URL(
                serverConfig.docs.fullPath,
                serverConfig.endpoint.external
            )}\n`;

            logger.log(log);
        });
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
bootstrap();
