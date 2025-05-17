import { APP_INTERCEPTOR, APP_PIPE } from "@nestjs/core";
import { Logger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtModule } from "@nestjs/jwt";
import { CustomValidationPipe, DefaultIfEmptyInterceptor } from "@app/common";
import {
    CONFIGURATIONS,
    MongooseConfigService,
    JwtConfigService,
} from "../config";
import { AuthUserService, AuthTokenService } from "./providers";
import { UserRepository, TokenRepository } from "./repositories";
import { User, UserSchema, Token, TokenSchema } from "./schemas";

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
        MongooseModule.forFeature([
            { name: User.name, schema: UserSchema },
            { name: Token.name, schema: TokenSchema },
        ]),
        JwtModule.registerAsync({
            useClass: JwtConfigService,
        }),
    ],
    controllers: [AuthController],
    providers: [
        AuthService,
        UserRepository,
        AuthUserService,
        AuthTokenService,
        TokenRepository,
        Logger,
        {
            provide: APP_PIPE,
            useClass: CustomValidationPipe,
        },
        {
            provide: APP_INTERCEPTOR,
            useClass: DefaultIfEmptyInterceptor,
        },
    ],
})
export class AuthModule {}
