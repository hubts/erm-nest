import { AbstractDocument } from "@app/common";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { EventConditionGroup, EventRewardModel } from "@app/sdk";

@Schema({
    versionKey: false,
    timestamps: {
        createdAt: "createdAt",
        updatedAt: "updatedAt",
    },
})
export class Event extends AbstractDocument {
    @Prop({ required: true })
    name: string;

    @Prop({ required: false })
    description?: string;

    @Prop({ required: false, type: String, default: "active" })
    status?: "active" | "inactive";

    @Prop({ required: true, type: Date })
    startedAt: Date;

    @Prop({ required: true, type: Date })
    endedAt: Date;

    @Prop({ required: true, type: Object })
    condition: EventConditionGroup;

    @Prop({ required: true, type: String })
    rewardDistributionType: "manual" | "auto";

    @Prop({ required: false })
    rewards: EventRewardModel[];

    @Prop({ required: false, default: Date.now })
    createdAt?: Date;

    @Prop({ required: false, default: Date.now })
    updatedAt?: Date;

    @Prop({ required: false })
    createdBy?: string;

    @Prop({ required: false })
    updatedBy?: string;

    @Prop({ required: false, type: Object })
    histories?: Record<string, Event>[];
}

export const EventSchema = SchemaFactory.createForClass(Event);
