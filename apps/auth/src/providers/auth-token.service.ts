import {
    BadRequestException,
    Inject,
    Injectable,
    UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { compareSync, hashSync } from "bcrypt";
import { JwtPayload, UserModel } from "@app/sdk";
import { TokenRepository } from "../repositories/token.repository";
import { JwtConfig } from "apps/auth/config/jwt.config";
import { ConfigType } from "@nestjs/config";

@Injectable()
export class AuthTokenService {
    constructor(
        @Inject(JwtConfig.KEY)
        private readonly jwtConfig: ConfigType<typeof JwtConfig>,
        private readonly tokenRepo: TokenRepository,
        private readonly jwtService: JwtService
    ) {}

    generateAccessToken(user: UserModel): string {
        const payload: JwtPayload = {
            id: user.id,
            email: user.email,
            role: user.role,
        };
        return this.jwtService.sign(payload);
    }

    async generateRefreshToken(user: UserModel): Promise<string> {
        const payload: Pick<JwtPayload, "id" | "email"> = {
            id: user.id,
            email: user.email,
        };
        const hash = hashSync(JSON.stringify(payload), 10);
        const token = this.jwtService.sign({
            hash,
        });
        await this.tokenRepo.create({
            token,
            userId: user.id,
            expiresAt: new Date(
                Date.now() + this.jwtConfig.refreshTokenExpiresIn
            ),
        });
        return token;
    }

    async assertRefreshToken(
        refreshToken: string,
        payload: Pick<JwtPayload, "id" | "email">
    ): Promise<void> {
        const { hash } = this.jwtService.verify(refreshToken);
        if (!compareSync(JSON.stringify(payload), hash)) {
            throw new BadRequestException("잘못된 갱신 토큰입니다.");
        }
    }

    async deleteRefreshTokens(userId: string): Promise<void> {
        await this.tokenRepo.deleteMany({ userId });
    }

    async getUserIdByRefreshToken(refreshToken: string): Promise<string> {
        const token = await this.tokenRepo.findOne({ token: refreshToken });
        if (!token) {
            throw new UnauthorizedException("잘못된 갱신 토큰입니다.");
        }
        if (token.expiresAt.getTime() < new Date().getTime()) {
            await this.tokenRepo.deleteOne({ token: refreshToken });
            throw new BadRequestException("만료된 갱신 토큰입니다.");
        }
        return token.userId;
    }
}
