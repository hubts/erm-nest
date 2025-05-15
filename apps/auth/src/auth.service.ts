import {
    AuthToken,
    IAuthService,
    LoginInput,
    RefreshInput,
    RegisterInput,
    UserModel,
} from "@app/sdk";
import { BadRequestException, Injectable } from "@nestjs/common";
import { UserRepository } from "./repositories/user.repository";
import { hashSync } from "bcrypt";
@Injectable()
export class AuthService implements IAuthService {
    constructor(private readonly userRepo: UserRepository) {}

    // 회원가입
    async register(input: RegisterInput): Promise<void> {
        const { email, password, nickname } = input;

        // Email 중복 체크
        const existingUser = await this.userRepo.findOne({ email });
        if (existingUser) {
            throw new BadRequestException("이미 존재하는 이메일입니다.");
        }

        // 생성
        await this.userRepo.create({
            email,
            password: hashSync(password, 10),
            nickname,
        });
    }

    // 로그인
    login(input: LoginInput): Promise<AuthToken> {
        throw new Error("Method not implemented.");
    }

    // 로그아웃
    logout(requestor: UserModel): Promise<void> {
        throw new Error("Method not implemented.");
    }

    // 토큰 갱신
    refresh(input: RefreshInput): Promise<AuthToken> {
        throw new Error("Method not implemented.");
    }
}
