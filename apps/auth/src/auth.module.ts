import { APP_INTERCEPTOR } from "@nestjs/core";
import { Logger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { JwtModule } from "@nestjs/jwt";
import { DefaultIfEmptyInterceptor } from "@app/common";
import {
    CONFIGURATIONS,
    MongooseConfigService,
    JwtConfigService,
} from "../config";
import { AuthUserService, AuthTokenService } from "./providers";
import { UserRepository, TokenRepository } from "./repositories";
import { User, UserSchema, Token, TokenSchema } from "./schemas";
import { AuthRpcHandler } from "./auth.rpc-handler";

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
    controllers: [AuthRpcHandler],
    providers: [
        AuthUserService,
        UserRepository,
        AuthTokenService,
        TokenRepository,
        Logger,
        {
            provide: APP_INTERCEPTOR,
            useClass: DefaultIfEmptyInterceptor,
        },
    ],
})
export class AuthModule {}
