import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { AuthRoute, IAuthService, UserModel } from "@app/sdk";
import {
    RegisterInputDto,
    LoginInputDto,
    AuthTokenDto,
    RefreshInputDto,
    RegisterAsInputDto,
} from "../../gateway/src/microservices/auth/dto";
import { AuthTokenService, AuthUserService } from "./providers";

@Controller()
export class AuthRpcHandler implements IAuthService {
    constructor(
        private readonly userService: AuthUserService,
        private readonly tokenService: AuthTokenService
    ) {}

    @MessagePattern(AuthRoute.register.cmd)
    async register(@Payload() args: [input: RegisterInputDto]): Promise<void> {
        const [input] = args;
        const { email, password, nickname } = input;
        await this.userService.assertDuplicateEmail(email);
        await this.userService.createUser({
            email,
            password,
            nickname,
        });
    }

    @MessagePattern(AuthRoute.login.cmd)
    async login(
        @Payload() args: [input: LoginInputDto]
    ): Promise<AuthTokenDto> {
        const [input] = args;
        const { email, password } = input;
        const user = await this.userService.getLoginUser(email, password);
        const accessToken = this.tokenService.generateAccessToken(user);
        const refreshToken = await this.tokenService.generateRefreshToken(user);
        return {
            accessToken,
            refreshToken,
        };
    }

    @MessagePattern(AuthRoute.logout.cmd)
    async logout(@Payload() args: [requestor: UserModel]): Promise<void> {
        const [requestor] = args;
        await this.tokenService.deleteRefreshTokens(requestor.id);
    }

    @MessagePattern(AuthRoute.refresh.cmd)
    async refresh(
        @Payload() args: [input: RefreshInputDto]
    ): Promise<AuthTokenDto> {
        const [input] = args;
        const { refreshToken } = input;
        const userId = await this.tokenService.getUserIdByRefreshToken(
            refreshToken
        );
        const user = await this.userService.findOneOrThrowById(userId);
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

    @MessagePattern(AuthRoute.registerAs.cmd)
    async registerAs(
        @Payload() args: [input: RegisterAsInputDto]
    ): Promise<void> {
        const [input] = args;
        const { email, password, role } = input;
        await this.userService.assertDuplicateEmail(email);
        await this.userService.createUser({
            email,
            password,
            role,
        });
    }

    @MessagePattern(AuthRoute.getAuthorizedUser.cmd)
    async getAuthorizedUser(@Payload() args: [id: string]): Promise<UserModel> {
        const [id] = args;
        return await this.userService.findOneOrThrowById(id);
    }
}
