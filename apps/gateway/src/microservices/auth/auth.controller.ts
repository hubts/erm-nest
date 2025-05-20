import { Body, Controller, Inject } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { ClientProxy } from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";
import {
    AuthRoute,
    IAuthController,
    SimpleUserModel,
    UserModel,
} from "@app/sdk";
import {
    asSuccessResponse,
    CommonResponseDto,
    Requestor,
    Route,
} from "@app/common";
import {
    RegisterInputDto,
    AuthTokenDto,
    LoginInputDto,
    RefreshInputDto,
    RegisterAsInputDto,
} from "apps/gateway/src/microservices/auth/dto";
import { AUTH_SERVICE } from "../../common/constants";

@ApiTags(AuthRoute.apiTags)
@Controller(AuthRoute.pathPrefix)
export class AuthController
    implements Omit<IAuthController, "getAuthorizedUser">
{
    constructor(
        @Inject(AUTH_SERVICE)
        private readonly authClient: ClientProxy
    ) {}

    @Route.Post(AuthRoute.register, {
        summary: "회원가입",
        success: {
            message: "회원가입에 성공하였습니다.",
        },
    })
    async register(
        @Body() input: RegisterInputDto
    ): Promise<CommonResponseDto<SimpleUserModel>> {
        const result = await firstValueFrom(
            this.authClient.send(AuthRoute.register.cmd, [input])
        );
        return asSuccessResponse("회원가입에 성공", result);
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
        const result = await firstValueFrom(
            this.authClient.send(AuthRoute.login.cmd, [input])
        );
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
        await firstValueFrom(
            this.authClient.send(AuthRoute.logout.cmd, [requestor])
        );
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
        const result = await firstValueFrom(
            this.authClient.send(AuthRoute.refresh.cmd, [input])
        );
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
        await firstValueFrom(
            this.authClient.send(AuthRoute.registerAs.cmd, [input])
        );
        return asSuccessResponse("특정 역할 회원가입에 성공");
    }
}
