import { ApiRouteOptions } from "@app/sdk";
import { ApiSpec, ApiSpecOptions } from "./api-spec.decorator";

/**
 * Defined API specification for each HTTP method.
 * Method, Route주소, Swagger 설정 등 데코레이터가 늘어나는 것을 방지하기 위해 하나의 데코레이터로 조합합니다.
 *
 * @ApiSpec 기능을 활용하며, 조합된 데코레이터는 아래와 같습니다.
 * - HttpMethod 데코레이터 (e.g. Post, Get)
 * - JWT 권한 설정 데코레이터
 * - Swagger 설정 데코레이터 (e.g. ApiOperation)
 * - 공통 응답 설정 데코레이터 (e.g. ApiResponse)
 */
export const Route = {
    Get: <R>(route: Partial<ApiRouteOptions<R>>, options: ApiSpecOptions) =>
        ApiSpec<R>({ ...route, ...options, method: "GET" }),
    Post: <R>(route: Partial<ApiRouteOptions<R>>, options: ApiSpecOptions) =>
        ApiSpec<R>({ ...route, ...options, method: "POST" }),
    Put: <R>(route: Partial<ApiRouteOptions<R>>, options: ApiSpecOptions) =>
        ApiSpec<R>({ ...route, ...options, method: "PUT" }),
    Patch: <R>(route: Partial<ApiRouteOptions<R>>, options: ApiSpecOptions) =>
        ApiSpec<R>({ ...route, ...options, method: "PATCH" }),
    Delete: <R>(route: Partial<ApiRouteOptions<R>>, options: ApiSpecOptions) =>
        ApiSpec<R>({ ...route, ...options, method: "DELETE" }),
};
