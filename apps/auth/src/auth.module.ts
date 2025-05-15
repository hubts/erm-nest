import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { CONFIGURATIONS } from "../config/configuration";
import { MongooseModule } from "@nestjs/mongoose";
import { MongooseConfigService } from "../config/mongoose.config.service";
import { User, UserSchema } from "./schemas/user.schema";
import { UserRepository } from "./repositories/user.repository";

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
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    ],
    controllers: [AuthController],
    providers: [AuthService, UserRepository],
})
export class AuthModule {}
