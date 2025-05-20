// 유저 권한 정의
export const UserRole = {
    USER: "USER",
    OPERATOR: "OPERATOR",
    AUDITOR: "AUDITOR",
    ADMIN: "ADMIN",
} as const;
export type UserRole = (typeof UserRole)[keyof typeof UserRole];
export const UserRoles = Object.values(UserRole);

/**
 * 유저 모델
 */
export interface UserModel {
    id: string;
    email: string;
    password: string;
    nickname: string;
    status: UserStatus;
    role: UserRole;
    joinedAt: Date;
    deletedAt: Date | null;
}

// 간단 유저 모델
export interface SimpleUserModel {
    id: string;
    email: string;
    nickname: string;
    role: UserRole;
    joinedAt: Date;
}

// 유저 상태 정의
export const UserStatus = {
    ACTIVE: "ACTIVE",
    INACTIVE: "INACTIVE",
    BLOCKED: "BLOCKED",
    DELETED: "DELETED",
} as const;
export type UserStatus = (typeof UserStatus)[keyof typeof UserStatus];

// JWT Payload 정의
export interface JwtPayload {
    id: string;
    email: string;
    role: UserRole;
}
