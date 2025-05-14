// 유저 권한 정의
export const UserRole = {
    USER: "USER",
    OPERATOR: "OPERATOR",
    AUDITOR: "AUDITOR",
    ADMIN: "ADMIN",
} as const;
export type UserRole = (typeof UserRole)[keyof typeof UserRole];
export const UserRoles = Object.values(UserRole);

// JWT Payload 정의
export interface JwtPayload {
    id: string;
    email: string;
    role: UserRole;
}
