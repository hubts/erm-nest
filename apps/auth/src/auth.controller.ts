import { Body, Controller } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { AuthRoute, IAuthController, UserModel } from "@app/sdk";
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
import { RegisterAsInputDto } from "./dto/body/register-as-input.dto";

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
        success: {
            message: "회원가입에 성공하였습니다.",
        },
    })
    async register(
        @Body() input: RegisterInputDto
    ): Promise<CommonResponseDto<void>> {
        await this.authService.register(input);
        return asSuccessResponse("회원가입에 성공");
    }

    @Route.Post(AuthRoute.login, {
        summary: "로그인",
        success: {
            message: "로그인에 성공하였습니다.",
            description: "로그인 성공 시 접근/갱신 토큰이 반환됩니다.",
            dataGenericType: AuthTokenDto,
        },
    })
    async login(
        @Body() input: LoginInputDto
    ): Promise<CommonResponseDto<AuthTokenDto>> {
        const result = await this.authService.login(input);
        return asSuccessResponse("로그인에 성공", result);
    }

    @Route.Post(AuthRoute.logout, {
        summary: "로그아웃",
        success: {
            message: "로그아웃에 성공하였습니다.",
        },
    })
    async logout(
        @Requestor() requestor: UserModel
    ): Promise<CommonResponseDto<void>> {
        await this.authService.logout(requestor);
        return asSuccessResponse("로그아웃에 성공");
    }

    @Route.Post(AuthRoute.refresh, {
        summary: "토큰 갱신",
        success: {
            message: "토큰 갱신에 성공하였습니다.",
            description: "토큰 갱신 성공 시 접근/갱신 토큰이 반환됩니다.",
            dataGenericType: AuthTokenDto,
        },
    })
    async refresh(
        @Body() input: RefreshInputDto
    ): Promise<CommonResponseDto<AuthTokenDto>> {
        const result = await this.authService.refresh(input);
        return asSuccessResponse("토큰 갱신에 성공", result);
    }

    @Route.Post(AuthRoute.registerAs, {
        summary: "특정 역할 회원가입",
        success: {
            message: "특정 역할 회원가입에 성공하였습니다.",
        },
    })
    async registerAs(
        @Body() input: RegisterAsInputDto
    ): Promise<CommonResponseDto<void>> {
        await this.authService.registerAs(input);
        return asSuccessResponse("특정 역할 회원가입에 성공");
    }
}
