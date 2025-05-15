import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { CONFIGURATIONS } from "../config/configuration";
import { MongooseModule } from "@nestjs/mongoose";
import { MongooseConfigService } from "../config/mongoose.config.service";
import { User, UserSchema } from "./schemas/user.schema";
import { UserRepository } from "./repositories/user.repository";
import { AuthTokenService } from "./providers/auth-token.service";
import { AuthUserService } from "./providers/auth-user.service";
import { JwtModule } from "@nestjs/jwt";
import { JwtConfigService } from "../config/jwt.config.service";
import { Token, TokenSchema } from "./schemas/token.schema";
import { TokenRepository } from "./repositories/token.repository";
import { JwtStrategy } from "./providers/jwt.strategy";

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
        JwtStrategy,
        AuthService,
        UserRepository,
        AuthUserService,
        AuthTokenService,
        TokenRepository,
    ],
})
export class AuthModule {}
