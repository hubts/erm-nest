import { AbstractDocument } from "@app/common";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({
    versionKey: false,
    timestamps: {
        createdAt: "createdAt",
    },
})
export class EventCondition extends AbstractDocument {
    @Prop({ required: true })
    fieldName: string;

    @Prop({ required: true })
    displayName: string;

    @Prop({ required: true, type: String })
    type: "string" | "number" | "date";

    @Prop({ required: false, default: Date.now })
    createdAt?: Date;

    @Prop({ required: true })
    createdBy: string;
}

export const EventConditionSchema =
    SchemaFactory.createForClass(EventCondition);
