import {
    AuthToken,
    IAuthService,
    LoginInput,
    RefreshInput,
    RegisterInput,
    UserModel,
} from "@app/sdk";
import { Injectable } from "@nestjs/common";
import { AuthUserService } from "./providers/auth-user.service";
import { AuthTokenService } from "./providers/auth-token.service";

@Injectable()
export class AuthService implements IAuthService {
    constructor(
        private readonly userService: AuthUserService,
        private readonly tokenService: AuthTokenService
    ) {}

    // 회원가입
    async register(input: RegisterInput): Promise<void> {
        const { email, password, nickname } = input;
        await this.userService.assertDuplicateEmail(email);
        await this.userService.createUser(email, password, nickname);
    }

    // 로그인
    async login(input: LoginInput): Promise<AuthToken> {
        const { email, password } = input;
        const user = await this.userService.getLoginUser(email, password);
        const accessToken = this.tokenService.generateAccessToken(user);
        const refreshToken = await this.tokenService.generateRefreshToken(user);
        return {
            accessToken,
            refreshToken,
        };
    }

    // 로그아웃
    async logout(requestor: UserModel): Promise<void> {
        await this.tokenService.deleteRefreshTokens(requestor.id);
    }

    // 토큰 갱신
    async refresh(input: RefreshInput): Promise<AuthToken> {
        const { refreshToken } = input;
        const userId = await this.tokenService.getUserIdByRefreshToken(
            refreshToken
        );
        console.log(userId);
        const user = await this.userService.findOneOrThrowById(userId);
        console.log(user);
        await this.tokenService.assertRefreshToken(refreshToken, {
            id: user.id,
            email: user.email,
        });
        const accessToken = this.tokenService.generateAccessToken(user);
        const newRefreshToken = await this.tokenService.generateRefreshToken(
            user
        );
        return { accessToken, refreshToken: newRefreshToken };
    }
}
