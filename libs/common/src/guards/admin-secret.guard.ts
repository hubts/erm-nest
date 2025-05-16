import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AdminSecretGuard implements CanActivate {
    constructor(private readonly configService: ConfigService) {}

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const secret = request.headers.secret;
        if (!secret) {
            return false;
        }
        return secret === this.configService.get<string>("ADMIN_SECRET");
    }
}
