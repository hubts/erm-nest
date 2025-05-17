import { CommonResponse } from "./common-response.interface";

/**
 * API HTTP Methods
 */
export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

/**
 * 하나의 함수에 대한 스펙을 정의하는 옵션 인터페이스
 * 특정 API에 대한 Method, Route주소, 호출에 필요한 권한, 관련된 설명 등을 작성합니다.
 */
export interface ApiRouteOptions<R> {
    /**
     * API HTTP Method
     * @example "GET", "POST"
     */
    method: HttpMethod;
    /**
     * 최상위 Route 하위 메소드의 실제 Path
     * @example "/api/events" 에서 "/events" 부분
     */
    subRoute: string;
    /**
     * 기능을 호출할 수 있는 권한(Role) 정의
     * @example [UserRole.ADMIN, UserRole.USER]
     */
    roles: R[];
    /**
     * API에 대한 설명 (Swagger)
     * @example ["이벤트를 생성합니다.", "관리자 권한이 필요합니다."]
     */
    description: string[];
    /**
     * 관리자 전용 API 여부 (역할 Admin 아님)
     * 관리자 페이지 등 Secret 값을 요구하는 non-permission API 등에 적용하는 옵션)
     * @default false
     */
    adminOnly?: boolean;
    /**
     * Microservice 메시지 패턴
     * @example "auth.register"
     */
    cmd?: string;
}

/**
 * 특정 도메인(e.g. User)에 존재하는 API들에 대한 스펙을 정의하는 타입
 * 이 타입으로 선언된 것은 서버의 Controller나 클라이언트가 호출하는 Request 서비스 구현에 이용될 수 있습니다.
 * @param apiTags - Swagger에 명시되는 API Tags
 * @param pathPrefix - 특정 도메인 API Route의 최상위 Path Prefix (e.g. "users")
 * @param ApiRouteOptions - 그리고 구현하는 해당 도메인에 존재하는 각 API들에 대해 정의할 수 있는 상세 옵션
 */
export type ApiRoute<T, R> = {
    /**
     * Swagger에 명시되는 API Tags
     * @example "User", "Authentication"
     */
    apiTags: string;
    /**
     * 특정 도메인 API Route의 최상위 Path Prefix
     * @example "users", "auth"
     */
    pathPrefix: string;
} & {
    /**
     * 구현하는 각 API에 대한 속성 정의
     * (특정 도메인 로직 서비스의 인터페이스를 기반으로 정의)
     * @example "AuthApi" 인터페이스에 정의한 "register", "login" 함수들에 대한 상세 정의
     */
    [key in keyof T]: ApiRouteOptions<R>;
};

/**
 * 특정 도메인 내 APIs에서 공통 응답(CommonResponse)을 제거한 타입
 * 공통 응답 외 실제 로직을 구현하는 Service의 인터페이스를 도출하기 위한 타입입니다.
 * @example "UserController implements UserApi" => "UserService implements ApiToService<UserApi>"
 */
export type ApiToService<T> = {
    [K in keyof T]: T[K] extends (
        ...args: infer P
    ) => Promise<CommonResponse<infer R>>
        ? (...args: P) => Promise<R>
        : never;
};

/**
 * 특정 도메인 내 APIs에서 공통 응답(CommonResponse)을 추가하는 타입
 * 구현된 Service의 인터페이스에 CommonResponse를 전부 추가하여, 실제 호출 인터페이스를 도출하기 위한 타입입니다.
 * @example "UserService implements UserApi" => "UserController implements ServiceToApi<UserApi>"
 */
export type ServiceToApi<T> = {
    [K in keyof T]: T[K] extends (...args: infer P) => Promise<infer R>
        ? (...args: P) => Promise<CommonResponse<R>>
        : never;
};
