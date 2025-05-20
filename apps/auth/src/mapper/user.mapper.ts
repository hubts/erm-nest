import { SimpleUserModel, UserModel } from "@app/sdk";
import { User } from "../schemas/user.schema";

export const UserMapper = {
    toModel: (user: User): UserModel => {
        return {
            id: user._id.toString(),
            email: user.email,
            nickname: user.nickname,
            password: user.password,
            status: user.status,
            role: user.role,
            joinedAt: user.createdAt,
            deletedAt: user.checkpoint?.deletedAt ?? null,
        };
    },
    toSimpleModel: (user: User): SimpleUserModel => {
        return {
            id: user._id.toString(),
            email: user.email,
            nickname: user.nickname,
            role: user.role,
            joinedAt: user.createdAt,
        };
    },
};
