import { CreateRewardInput } from "@app/sdk";
import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsNumber, IsIn } from "class-validator";

export class CreateRewardInputDto implements CreateRewardInput {
    @ApiProperty({
        description: "보상 이름",
        example: "캐시",
    })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        description: "보상 타입",
        enum: ["cash", "point", "coupon", "item"],
    })
    @IsIn(["cash", "point", "coupon", "item"])
    @IsNotEmpty()
    type: "cash" | "point" | "coupon" | "item";

    @ApiProperty({
        description: "보상 수량",
        example: 10000,
    })
    @IsNumber()
    @IsNotEmpty()
    amount: number;
}
