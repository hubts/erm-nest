import { CommonResponse } from "./common-response.interface";

/**
 * API HTTP Methods
 */
export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

/**
 * API Route에 대한 속성 정의
 * @summary 특정 API에 대한 설정, 권한, 설명 등을 정의합니다.
 */
export interface ApiRouteOptions<R> {
    /**
     * API HTTP Method
     */
    method: HttpMethod;
    /**
     * 최상위 Route 아래의 Path
     * @example "/api/events" 에서 "/events" 부분
     */
    subRoute: string;
    /**
     * 기능을 호출할 수 있는 권한(Role) 정의
     * @example ["admin", "user"]
     */
    roles: R[];
    /**
     * API에 대한 설명
     * @example ["이벤트를 생성합니다.", "관리자 권한이 필요합니다."]
     */
    description: string[];
}

/**
 * 특정 도메인 최상위 API 구현 인터페이스
 * @summary 특정 도메인(Auth, User)을 구현하는 서버의 Controller나 클라이언트가 호출하는 Request 서비스에 이용될 수 있다.
 */
export type ApiRoute<T, R> = {
    /**
     * Swagger에 명시되는 API Tags
     */
    apiTags: string;
    /**
     * 특정 도메인 API Route의 최상위 Path Prefix
     */
    pathPrefix: string;
} & {
    /**
     * 구현하는 각 API에 대한 속성 정의
     */
    [key in keyof T]: ApiRouteOptions<R>;
};

/**
 * 특정 도메인 내 APIs에서 공통 응답(CommonResponse)을 제거한 타입
 * @summary 공통 응답 외 실제 로직을 구현하는 Service의 인터페이스를 도출하기 위한 타입
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
 * @summary 구현된 Service의 인터페이스에 CommonResponse를 전부 추가하여, 실제 호출 인터페이스를 도출하기 위한 타입
 * @example "UserService implements UserApi" => "UserController implements ServiceToApi<UserApi>"
 */
export type ServiceToApi<T> = {
    [K in keyof T]: T[K] extends (...args: infer P) => Promise<infer R>
        ? (...args: P) => Promise<CommonResponse<R>>
        : never;
};
