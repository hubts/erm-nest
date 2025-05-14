import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { CONFIGURATIONS } from "../config/configuration";
import { MongooseModule } from "@nestjs/mongoose";
import { MongooseConfigService } from "../config/mongoose.config.service";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: CONFIGURATIONS,
            envFilePath: "./apps/auth/.env",
        }),
        MongooseModule.forRootAsync({
            useClass: MongooseConfigService,
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService],
})
export class AuthModule {}
