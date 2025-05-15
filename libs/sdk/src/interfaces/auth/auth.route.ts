import { ApiRoute } from "@app/sdk";
import { AuthApi } from "./auth.api";
import { UserRole, UserRoles } from "./auth.model";

/**
 * 인증 API Specification
 * AuthController 또는 Client 실제 호출 서비스 구현 시 이용
 */
export const AuthRoute: ApiRoute<AuthApi, UserRole> = {
    apiTags: "Authentication",
    pathPrefix: "", // MSA 미사용
    register: {
        method: "POST",
        subRoute: "/register",
        roles: [],
        description: ["회원가입"],
    },
    login: {
        method: "POST",
        subRoute: "/login",
        roles: [],
        description: ["로그인"],
    },
    logout: {
        method: "POST",
        subRoute: "/logout",
        roles: [...UserRoles],
        description: ["로그아웃"],
    },
    refresh: {
        method: "POST",
        subRoute: "/refresh",
        roles: [],
        description: ["토큰 갱신"],
    },
};
