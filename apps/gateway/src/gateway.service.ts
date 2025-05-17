import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { firstValueFrom } from "rxjs";

@Injectable()
export class GatewayService {
    constructor(private readonly httpService: HttpService) {}

    async request<T>(config: {
        method: "GET" | "POST" | "PUT" | "DELETE";
        url: string;
        data?: any;
        params?: any;
    }): Promise<T> {
        const { method, url, data, params } = config;

        const response = await firstValueFrom(
            this.httpService.request({
                method,
                url,
                data,
                params,
            })
        );

        return response.data;
    }
}
