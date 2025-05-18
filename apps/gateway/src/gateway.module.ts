import { Logger, Module } from "@nestjs/common";
import { APP_FILTER, APP_PIPE } from "@nestjs/core";
import { ConfigModule } from "@nestjs/config";
import { CONFIGURATIONS } from "../config/configuration";
import { ClientsModule } from "@nestjs/microservices";
import { AUTH_SERVICE, EVENT_SERVICE } from "./gateway.constants";
import { AuthServiceConfigService } from "../config/microservices/auth-service.config.service";
import { EventServiceConfigService } from "../config/microservices/event-service.config.service";
import { AllExceptionFilter, CustomValidationPipe } from "@app/common";
import { JwtStrategy } from "./common/jwt.strategy";
import { EventController } from "./microservices/event/event.controller";
import { AuthController } from "./microservices/auth/auth.controller";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: CONFIGURATIONS,
            envFilePath: "./apps/gateway/.env",
        }),
        ClientsModule.registerAsync({
            clients: [
                {
                    name: AUTH_SERVICE,
                    useClass: AuthServiceConfigService,
                },
                {
                    name: EVENT_SERVICE,
                    useClass: EventServiceConfigService,
                },
            ],
        }),
    ],
    controllers: [AuthController, EventController],
    providers: [
        JwtStrategy,
        Logger,
        {
            provide: APP_FILTER,
            useClass: AllExceptionFilter,
        },
        {
            provide: APP_PIPE,
            useClass: CustomValidationPipe,
        },
    ],
})
export class GatewayModule {}
