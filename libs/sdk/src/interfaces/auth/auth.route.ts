import { ApiRoute } from "@app/sdk";
import { AuthApi } from "./auth.api";
import { UserRole, UserRoles } from "./auth.model";

/**
 * 인증 API Specification
 * AuthController 또는 Client 실제 호출 서비스 구현 시 이용
 */
export const AuthRoute: ApiRoute<AuthApi, UserRole> = {
    apiTags: "Authentication",
    pathPrefix: "auth",
    register: {
        method: "POST",
        subRoute: "/register",
        cmd: "auth.register",
        roles: [],
        description: ["회원가입"],
    },
    login: {
        method: "POST",
        subRoute: "/login",
        cmd: "auth.login",
        roles: [],
        description: ["로그인"],
    },
    logout: {
        method: "POST",
        subRoute: "/logout",
        cmd: "auth.logout",
        roles: [...UserRoles],
        description: ["로그아웃"],
    },
    refresh: {
        method: "POST",
        subRoute: "/refresh",
        cmd: "auth.refresh",
        roles: [],
        description: ["토큰 갱신"],
    },
    registerAs: {
        method: "POST",
        subRoute: "/register-as",
        cmd: "auth.registerAs",
        roles: [],
        adminOnly: true,
        description: ["특정 역할 회원가입"],
    },
    getAuthorizedUser: {
        method: "GET",
        subRoute: "/authorized-user",
        cmd: "auth.getAuthorizedUser",
        roles: [],
        description: ["인증된 유저 조회"],
    },
};
