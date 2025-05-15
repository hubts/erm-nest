import { AbstractDocument } from "@app/common";
import { UserRole, UserStatus } from "@app/sdk";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({
    versionKey: false,
    timestamps: {
        createdAt: "createdAt",
        updatedAt: "updatedAt",
    },
})
export class User extends AbstractDocument {
    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop({ required: true })
    nickname: string;

    @Prop({
        required: false,
        type: String,
        enum: UserStatus,
        default: UserStatus.ACTIVE,
    })
    status?: UserStatus;

    @Prop({
        required: false,
        type: String,
        enum: UserRole,
        default: UserRole.USER,
    })
    role?: UserRole;

    @Prop({
        required: false,
        type: {
            activatedAt: Date,
            deactivatedAt: Date,
            blockedAt: Date,
            deletedAt: Date,
        },
    })
    checkpoint?: {
        activatedAt: Date | null;
        deactivatedAt: Date | null;
        blockedAt: Date | null;
        deletedAt: Date | null;
    };
}

export const UserSchema = SchemaFactory.createForClass(User);
