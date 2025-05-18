import { AbstractDocument } from "@app/common";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import {
    EventModel,
    EventRewardModel,
    EventUserLoggingModel,
    UserModel,
} from "@app/sdk";

@Schema({
    versionKey: false,
    timestamps: {
        createdAt: "createdAt",
        updatedAt: "updatedAt",
    },
})
export class EventRewardRequest extends AbstractDocument {
    @Prop({ required: true, type: Object })
    event: EventModel;

    @Prop({ required: true, type: Object })
    user: UserModel;

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
