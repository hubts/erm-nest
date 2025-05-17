import { Controller } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { AuthRoute, IAuthService, UserModel } from "@app/sdk";
import { AuthService } from "./auth.service";
import {
    RegisterInputDto,
    LoginInputDto,
    AuthTokenDto,
    RefreshInputDto,
    RegisterAsInputDto,
} from "./dto";

@ApiTags(AuthRoute.apiTags)
@Controller()
export class AuthController implements IAuthService {
    constructor(private readonly authService: AuthService) {}

    @MessagePattern(AuthRoute.register.cmd)
    async register(@Payload() input: RegisterInputDto): Promise<void> {
        await this.authService.register(input);
    }

    @MessagePattern(AuthRoute.login.cmd)
    async login(@Payload() input: LoginInputDto): Promise<AuthTokenDto> {
        return await this.authService.login(input);
    }

    @MessagePattern(AuthRoute.logout.cmd)
    async logout(@Payload() user: UserModel): Promise<void> {
        await this.authService.logout(user);
    }

    @MessagePattern(AuthRoute.refresh.cmd)
    async refresh(@Payload() input: RefreshInputDto): Promise<AuthTokenDto> {
        return await this.authService.refresh(input);
    }

    @MessagePattern(AuthRoute.registerAs.cmd)
    async registerAs(@Payload() input: RegisterAsInputDto): Promise<void> {
        await this.authService.registerAs(input);
    }

    @MessagePattern(AuthRoute.getAuthorizedUser.cmd)
    async getAuthorizedUser(@Payload() id: string): Promise<UserModel> {
        return await this.authService.getAuthorizedUser(id);
    }
}
