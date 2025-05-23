import { NestExpressApplication } from "@nestjs/platform-express";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { SwaggerTheme, SwaggerThemeNameEnum } from "swagger-themes";
import { SwaggerSetupOptions } from "./interface";

export function setupSwagger(
    app: NestExpressApplication,
    options: SwaggerSetupOptions
): void {
    const {
        path,
        serverUrl,
        localhostPort,
        title,
        description,
        version,
        extraModels,
    } = options;

    // Setup the configurations.
    const swaggerConfig = new DocumentBuilder();
    if (serverUrl) {
        swaggerConfig.addServer(serverUrl);
    } else if (localhostPort) {
        swaggerConfig.addServer(`http://localhost:${localhostPort}`);
    }
    if (title) {
        swaggerConfig.setTitle(title);
    }
    if (description) {
        swaggerConfig.setDescription(description);
    }
    if (version) {
        swaggerConfig.setVersion(version);
    }

    // JWT
    swaggerConfig.addBearerAuth({
        type: "http",
        bearerFormat: "JWT",
    });
    swaggerConfig.addBasicAuth({
        type: "apiKey",
        in: "header",
        name: "secret",
    });
    const swaggerDocument = SwaggerModule.createDocument(
        app,
        swaggerConfig.build(),
        {
            extraModels: extraModels ?? [],
        }
    );

    // NOTE: You can change the style of swagger from here.
    const theme = new SwaggerTheme();
    const style = theme.getBuffer(SwaggerThemeNameEnum.ONE_DARK);

    // Finally
    SwaggerModule.setup(path, app, swaggerDocument, {
        explorer: true,
        customCss: style,
        swaggerOptions: {
            persistAuthorization: true, // Options to persist JWT
            tagsSorter: "alpha",
            // operationsSorter: "alpha",
        },
    });
}
