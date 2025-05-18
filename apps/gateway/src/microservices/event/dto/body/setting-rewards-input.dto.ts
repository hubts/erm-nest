import { SettingRewardsInput } from "@app/sdk";
import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty } from "class-validator";
import { CreateRewardInputDto } from "./create-reward-input.dto";

export class SettingRewardsInputDto implements SettingRewardsInput {
    @ApiProperty({
        description: "보상 목록",
        type: [CreateRewardInputDto],
    })
    @IsArray()
    @IsNotEmpty()
    rewards: CreateRewardInputDto[];
}
