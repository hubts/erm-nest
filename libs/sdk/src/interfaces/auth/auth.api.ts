import { UserModel, UserRole } from "./auth.model";
import { ServiceToApi } from "@app/sdk";

/**
 * 인증 API 인터페이스
 * @summary AuthService 구현 시 이용
 */
export interface AuthApi<R extends UserModel | string | undefined = undefined> {
    // Register
    register(input: RegisterInput): Promise<void>;
    // Login
    login(input: LoginInput): Promise<AuthToken>;
    // Logout
    logout(requestor: R): Promise<void>;
    // Refresh tokens
    refresh(input: RefreshInput): Promise<AuthToken>;
    // Register as special role
    registerAs(input: RegisterAsInput): Promise<void>;
    // Get authorized user
    getAuthorizedUser(id: string): Promise<UserModel>;
}
export type IAuthService = AuthApi<UserModel>;
export type IAuthController = ServiceToApi<AuthApi<UserModel>>;

// 회원가입 입력
export interface RegisterInput
    extends Pick<UserModel, "email" | "password" | "nickname"> {}

// 로그인 입력
export interface LoginInput extends Pick<UserModel, "email" | "password"> {}

// 인증 토큰
export interface AuthToken {
    accessToken: string;
    refreshToken: string;
}

// 토큰 갱신 입력
export interface RefreshInput {
    refreshToken: string;
}

// 회원가입(관리자, 감사자, 운영자) 입력
export interface RegisterAsInput extends Pick<UserModel, "email" | "password"> {
    role: UserRole;
}
