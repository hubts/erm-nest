import {
    Delete,
    Get,
    NotImplementedException,
    Patch,
    Post,
    Put,
    UseGuards,
} from "@nestjs/common";
import { ApiBasicAuth, ApiOperation } from "@nestjs/swagger";
import {
    ApiResSuccess,
    ApiResSuccessOptions,
} from "./api-res-success.decorator";
import { ApiRouteOptions, HttpMethod } from "@app/sdk";
import { JwtRolesAuth } from "../auth";
import { AdminSecretGuard } from "../../guards";

/**
 * Option interface of API specification.
 *
 * @param summary - Summary of the API.
 * @param method - HTTP method of the API (optional).
 * @param deprecated - Whether the API is deprecated (optional).
 * @param passThrough - Whether the API is pass through (no permission check) (optional).
 * @param success - Options for the successful API response (optional).
 * @param errors - Error names for the API response (optional).
 */
export interface ApiSpecOptions {
    summary: string;
    method?: HttpMethod;
    deprecated?: boolean;
    success?: ApiResSuccessOptions;
    // errors?: ErrorName[];
}

/**
 * Decorators for API specification.
 *
 * This decorator is a wrapper of NestJS decorators for API specification.
 * This decorator includes API route, JWT roles, success response, and error response.
 * You can use this to define API specification for each method in controllers.
 * See the examples of usage in any controllers.
 *
 * @param options {ApiSpecOptions} - Options for the API specification.
 *
 * Below are the options inherited from 'ApiRouteOptions' which defines API route.
 * @param subRoute - Sub-route of the API.
 * @param roles - Required roles for the API.
 * @param description - Description of the API.
 */
export const ApiSpec = <R>(
    options: ApiSpecOptions & Partial<ApiRouteOptions<R>>
): MethodDecorator => {
    const {
        method,
        subRoute,
        description,
        roles,
        summary,
        deprecated,
        success,
        adminOnly,
    } = options;
    // const errors = options.errors ?? [];

    return <T>(
        target: object,
        key: string | symbol,
        descriptor: TypedPropertyDescriptor<T>
    ) => {
        /**
         * HTTP Method
         */
        let HttpMethod = Get;
        switch (method) {
            case "GET": {
                HttpMethod = Get;
                break;
            }
            case "POST": {
                HttpMethod = Post;
                break;
            }
            case "PUT": {
                HttpMethod = Put;
                break;
            }
            case "PATCH": {
                HttpMethod = Patch;
                break;
            }
            case "DELETE": {
                HttpMethod = Delete;
                break;
            }
            default: {
                throw new NotImplementedException("NOT_IMPLEMENTED");
            }
        }
        HttpMethod(subRoute)(target, key, descriptor);

        /**
         * Set JWT roles
         */
        JwtRolesAuth(roles)(target, key, descriptor);
        // if (roles?.length) {
        //     // If roles(permissions) are required, set errors related to access.
        //     // 401, 403
        //     errors.push("UNAUTHORIZED", "FORBIDDEN_RESOURCE");
        // }

        /**
         * Set Admin Secret Guard if adminOnly is true
         */
        if (adminOnly) {
            UseGuards(AdminSecretGuard)(target, key, descriptor);
            ApiBasicAuth()(target, key, descriptor);
        }

        /**
         * Set API operation
         */
        ApiOperation({
            operationId: key.toString(),
            summary,
            description: description?.length ? description.join("\n\n") : "",
            deprecated: deprecated ?? false,
        })(target, key, descriptor);

        /**
         * Set pre-defined success response.
         */
        if (success) {
            ApiResSuccess(success)(target, key, descriptor);
        }

        // Set default errors.
        // 400, 500, 503
        // errors.push(
        //     "BAD_REQUEST",
        //     "INTERNAL_SERVER_ERROR",
        //     "SERVICE_UNAVAILABLE"
        // );
        // Set pre-defined error responses.
        // if (errors?.length) {
        //     ApiResErrors(errors)(target, key, descriptor);
        // }

        // Return.
        return descriptor;
    };
};
