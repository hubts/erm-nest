import { AbstractDocument } from "@app/common";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class Token extends AbstractDocument {
    @Prop({ required: true, unique: true })
    token: string;

    @Prop({ required: true })
    userId: string;

    @Prop({ required: true })
    expiresAt: Date;
}

export const TokenSchema = SchemaFactory.createForClass(Token);
