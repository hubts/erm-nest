import { AbstractDocument } from "@app/common";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { SchemaTypes } from "mongoose";

@Schema({
    versionKey: false,
    timestamps: {
        createdAt: "createdAt",
    },
})
export class EventUserLogging extends AbstractDocument {
    @Prop({ required: true, type: Object })
    userId: string;

    @Prop({ required: false, default: Date.now })
    createdAt?: Date;

    @Prop({ required: true, type: String })
    fieldName: string;

    @Prop({ required: true, type: SchemaTypes.Mixed })
    value: string | number | Date;

    @Prop({ required: false, type: Object })
    metadata?: Record<string, any>;
}

export const EventUserLoggingSchema =
    SchemaFactory.createForClass(EventUserLogging);
