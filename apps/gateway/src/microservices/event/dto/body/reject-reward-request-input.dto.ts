import { RejectRewardRequestInput } from "@app/sdk";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsString, IsOptional } from "class-validator";

export class RejectRewardRequestInputDto implements RejectRewardRequestInput {
    @ApiPropertyOptional({
        description: "거절 이유",
        example: "보상 수량이 부족합니다.",
    })
    @IsString()
    @IsOptional()
    reason?: string;
}
