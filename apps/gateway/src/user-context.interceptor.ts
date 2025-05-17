import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { HttpService } from "@nestjs/axios";
import { UserModel } from "@app/sdk";

@Injectable()
export class UserContextInterceptor implements NestInterceptor {
    constructor(private readonly httpService: HttpService) {}

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const user = request.user as UserModel;

        // 마이크로서비스 호출 시 사용할 헤더 설정
        const headers = {
            "x-user-id": user.id,
            "x-user-role": user.role,
        };

        // HttpService의 기본 헤더 설정
        this.httpService.axiosRef.defaults.headers.common = {
            ...this.httpService.axiosRef.defaults.headers.common,
            ...headers,
        };

        return next.handle().pipe(
            tap(() => {
                delete this.httpService.axiosRef.defaults.headers.common[
                    "x-user-id"
                ];
                delete this.httpService.axiosRef.defaults.headers.common[
                    "x-user-role"
                ];
            })
        );
    }
}
