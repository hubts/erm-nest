import { CreateEventInput, EventConditionGroup } from "@app/sdk";
import { faker } from "@faker-js/faker";
import { ApiProperty } from "@nestjs/swagger";
import {
    IsString,
    IsNotEmpty,
    IsDateString,
    IsIn,
    IsObject,
    IsArray,
} from "class-validator";
import { CreateRewardInputDto } from "./create-reward-input.dto";
import { generateId } from "@app/common";

export class CreateEventInputDto implements CreateEventInput {
    @ApiProperty({
        description: "이벤트 이름",
        example: faker.lorem.word(),
    })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        description: "이벤트 설명",
        example: faker.lorem.sentence(),
    })
    @IsString()
    @IsNotEmpty()
    description: string;

    @ApiProperty({
        description: "이벤트 시작 시간",
        example: faker.date.recent(),
    })
    @IsDateString()
    @IsNotEmpty()
    startedAt: Date;

    @ApiProperty({
        description: "이벤트 종료 시간",
        example: faker.date.future(),
    })
    @IsDateString()
    @IsNotEmpty()
    endedAt: Date;

    @ApiProperty({
        description: "이벤트 보상 지급 방식",
        enum: ["manual", "auto"],
    })
    @IsIn(["manual", "auto"])
    @IsNotEmpty()
    rewardDistributionType: "manual" | "auto";

    @ApiProperty({
        description: "이벤트 조건",
        example: {
            operator: "and",
            conditions: [
                {
                    leftOperand: {
                        id: generateId(),
                    },
                    operator: "eq",
                    rightOperand: 7,
                },
                {
                    operator: "or",
                    conditions: [
                        {
                            leftOperand: {
                                id: generateId(),
                            },
                            operator: "gte",
                            rightOperand: 1000,
                        },
                        {
                            leftOperand: {
                                id: generateId(),
                            },
                            operator: "eq",
                            rightOperand: "VIP",
                        },
                    ],
                },
            ],
        },
    })
    @IsObject()
    @IsNotEmpty()
    condition: EventConditionGroup;

    @ApiProperty({
        description: "이벤트 보상",
        type: [CreateRewardInputDto],
    })
    @IsArray()
    @IsNotEmpty()
    rewards: CreateRewardInputDto[];

    @ApiProperty({
        description: "이벤트 상태",
        enum: ["active", "inactive"],
    })
    @IsIn(["active", "inactive"])
    @IsNotEmpty()
    status: "active" | "inactive";
}
