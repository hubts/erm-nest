import { CommonResponse } from "@app/sdk";

export const asSuccessResponse = <T>(
    message: string,
    data: T | null = null
): CommonResponse<T> => {
    return {
        success: true,
        message,
        data,
    };
};

export const asErrorResponse = <T>(
    message: string,
    data: T | null = null
): CommonResponse<T> => {
    return {
        success: false,
        message,
        data,
    };
};
