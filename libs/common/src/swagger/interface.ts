/* eslint-disable @typescript-eslint/ban-types */
import { SwaggerThemeNameEnum } from "swagger-themes";

export interface SwaggerSetupOptions {
    path: string;
    theme?: SwaggerThemeNameEnum;
    serverUrl?: string;
    localhostPort?: number;
    title?: string;
    description?: string;
    version?: string;
    extraModels?: Function[];
}
