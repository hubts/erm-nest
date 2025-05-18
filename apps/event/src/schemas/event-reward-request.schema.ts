import { AbstractDocument } from "@app/common";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { EventRewardModel, EventUserLoggingModel } from "@app/sdk";
import { Types } from "mongoose";
import { Event } from "./event.schema";
import { User } from "apps/auth/src/schemas";

@Schema({
    versionKey: false,
    timestamps: {
        createdAt: "createdAt",
        updatedAt: "updatedAt",
    },
})
export class EventRewardRequest extends AbstractDocument {
    @Prop({ type: Types.ObjectId, ref: "Event" })
    event: Types.ObjectId | Event;

    @Prop({ type: Types.ObjectId, ref: "User" })
    user: Types.ObjectId | User;

    @Prop({ required: true, type: String, default: "pending" })
    status: "pending" | "insufficient" | "approved" | "rejected";

    @Prop({ required: false, type: String })
    reason?: string;

    @Prop({ required: false, type: Date, default: Date.now })
    determinedAt?: Date;

    @Prop({ required: false, type: String })
    determinedBy?: string;

    @Prop({ required: false, default: Date.now })
    createdAt?: Date;

    @Prop({ required: false, default: Date.now })
    updatedAt?: Date;

    @Prop({ required: false, type: [Object] })
    receivedRewards?: EventRewardModel[];

    @Prop({ required: false, type: [Object] })
    eventUserLoggings?: EventUserLoggingModel[];

    @Prop({ required: false, type: Object })
    histories?: Record<string, EventRewardRequest>[];
}

export const EventRewardRequestSchema =
    SchemaFactory.createForClass(EventRewardRequest);
