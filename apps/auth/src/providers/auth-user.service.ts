import { HttpStatus, Injectable } from "@nestjs/common";
import { hashSync, compareSync } from "bcrypt";
import { UserModel, UserRole } from "@app/sdk";
import { UserRepository } from "../repositories/user.repository";
import { UserMapper } from "../mapper/user.mapper";
import { RpcException } from "@nestjs/microservices";
import { generateId } from "@app/common";

@Injectable()
export class AuthUserService {
    constructor(private readonly userRepo: UserRepository) {}

    async assertDuplicateEmail(email: string): Promise<void> {
        const user = await this.userRepo.findOne({ email });
        if (user) {
            throw new RpcException({
                statusCode: HttpStatus.BAD_REQUEST,
                message: "이미 존재하는 이메일입니다.",
            });
        }
    }

    async findOneOrThrowByEmail(email: string): Promise<UserModel> {
        const user = await this.userRepo.findOne({ email });
        if (!user) {
            throw new RpcException({
                statusCode: HttpStatus.NOT_FOUND,
                message: "존재하지 않는 이메일입니다.",
            });
        }
        return UserMapper.toModel(user);
    }

    async createUser(data: {
        email: string;
        password: string;
        role?: UserRole;
        nickname?: string;
    }): Promise<UserModel> {
        const { email, password, role, nickname } = data;
        const user = await this.userRepo.create({
            email,
            password: hashSync(password, 10),
            nickname: nickname ?? `${role ?? UserRole.USER}-${generateId()}`,
            ...(role && { role }),
        });
        return UserMapper.toModel(user);
    }

    async getLoginUser(email: string, password: string): Promise<UserModel> {
        const user = await this.findOneOrThrowByEmail(email);
        if (!compareSync(password, user.password)) {
            throw new RpcException({
                statusCode: HttpStatus.BAD_REQUEST,
                message: "비밀번호가 일치하지 않습니다.",
            });
        }
        return user;
    }

    async findOneOrThrowByRefreshToken(
        refreshToken: string
    ): Promise<UserModel> {
        const user = await this.userRepo.findOne({ refreshToken });
        if (!user) {
            throw new RpcException({
                statusCode: HttpStatus.NOT_FOUND,
                message: "존재하지 않는 토큰입니다.",
            });
        }
        return UserMapper.toModel(user);
    }

    async findOneOrThrowById(id: string): Promise<UserModel> {
        const user = await this.userRepo.findOne({ _id: id });
        if (!user) {
            throw new RpcException({
                statusCode: HttpStatus.NOT_FOUND,
                message: "존재하지 않는 유저입니다.",
            });
        }
        return UserMapper.toModel(user);
    }
}
