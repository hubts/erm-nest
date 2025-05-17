import { CreateEventInput, EventConditionGroup } from "@app/sdk";
import { faker } from "@faker-js/faker";
import { ApiProperty } from "@nestjs/swagger";
import {
    IsString,
    IsNotEmpty,
    IsDateString,
    IsIn,
    IsObject,
} from "class-validator";

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
        example: "manual",
    })
    @IsString()
    @IsNotEmpty()
    @IsIn(["manual", "auto"])
    rewardDistributionType: "manual" | "auto";

    @ApiProperty({
        description: "이벤트 조건",
        example: {
            operator: "and",
            conditions: [
                {
                    leftOperand: {
                        id: faker.string.uuid(),
                    },
                    operator: "eq",
                    rightOperand: 7,
                },
                {
                    operator: "or",
                    conditions: [
                        {
                            leftOperand: {
                                id: faker.string.uuid(),
                            },
                            operator: "geq",
                            rightOperand: 1000,
                        },
                        {
                            leftOperand: {
                                id: faker.string.uuid(),
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
}
