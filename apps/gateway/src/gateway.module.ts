import { Module } from "@nestjs/common";
import { GatewayController } from "./gateway.controller";
import { GatewayService } from "./gateway.service";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { UserContextInterceptor } from "./user-context.interceptor";
import { HttpModule } from "@nestjs/axios";
import { ConfigModule } from "@nestjs/config";
import { CONFIGURATIONS } from "../config/configuration";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: CONFIGURATIONS,
        }),
        HttpModule.register({
            timeout: 10000,
        }),
    ],
    controllers: [GatewayController],
    providers: [
        GatewayService,
        {
            provide: APP_INTERCEPTOR,
            useClass: UserContextInterceptor,
        },
    ],
})
export class GatewayModule {}
