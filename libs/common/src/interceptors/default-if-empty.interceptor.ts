import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from "@nestjs/common";
import { catchError, map, Observable } from "rxjs";

@Injectable()
export class DefaultIfEmptyInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(
            map(data => {
                // void나 undefined인 경우 빈 객체 반환
                if (data === undefined || data === null) {
                    return {};
                }
                return data;
            }),
            catchError(err => {
                throw err;
            })
        );
    }
}
