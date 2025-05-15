import { Body, Controller } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthRoute, IAuthController, UserModel } from "@app/sdk";
import { ApiTags } from "@nestjs/swagger";
import {
    asSuccessResponse,
    CommonResponseDto,
    Requestor,
    Route,
} from "@app/common";
import { RegisterInputDto } from "./dto/body/register-input.dto";
import { LoginInputDto } from "./dto/body/login-input.dto";
import { AuthTokenDto } from "./dto/response/auth-token.dto";
import { RefreshInputDto } from "./dto/body/refresh-input.dto";

@ApiTags(AuthRoute.apiTags)
@Controller()
export class AuthController implements IAuthController {
    constructor(private readonly authService: AuthService) {}

    @Route.Get({ subRoute: "/" }, { summary: "헬스체크" })
    hello(): string {
        return "Hello, World! from AuthController";
    }

    @Route.Post(AuthRoute.register, {
        summary: "회원가입",
    })
    async register(
        @Body() input: RegisterInputDto
    ): Promise<CommonResponseDto<void>> {
        await this.authService.register(input);
        return asSuccessResponse("회원가입에 성공");
    }

    @Route.Post(AuthRoute.login, {
        summary: "로그인",
    })
    async login(
        @Body() input: LoginInputDto
    ): Promise<CommonResponseDto<AuthTokenDto>> {
        const result = await this.authService.login(input);
        return asSuccessResponse("로그인에 성공", result);
    }

    @Route.Post(AuthRoute.logout, {
        summary: "로그아웃",
    })
    async logout(
        @Requestor() requestor: UserModel
    ): Promise<CommonResponseDto<void>> {
        await this.authService.logout(requestor);
        return asSuccessResponse("로그아웃에 성공");
    }

    @Route.Post(AuthRoute.refresh, {
        summary: "토큰 갱신",
    })
    async refresh(
        @Body() input: RefreshInputDto
    ): Promise<CommonResponseDto<AuthTokenDto>> {
        const result = await this.authService.refresh(input);
        return asSuccessResponse("토큰 갱신에 성공", result);
    }
}
