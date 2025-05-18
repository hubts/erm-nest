import { FindAllRewardRequestsQuery } from "@app/sdk";
import { PaginationQueryDto } from "@app/common";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsString, IsOptional, IsIn } from "class-validator";
import { faker } from "@faker-js/faker";

export class FindAllRewardRequestsQueryDto
    extends PaginationQueryDto
    implements FindAllRewardRequestsQuery
{
    @ApiPropertyOptional({
        description: "이벤트 ID",
        example: faker.string.uuid(),
    })
    @IsString()
    @IsOptional()
    eventId?: string;

    @ApiPropertyOptional({
        description: "사용자 ID",
        example: faker.string.uuid(),
    })
    @IsString()
    @IsOptional()
    userId?: string;

    @ApiPropertyOptional({
        description: "보상 요청 상태",
        enum: ["pending", "insufficient", "approved", "rejected"],
    })
    @IsIn(["pending", "insufficient", "approved", "rejected"])
    @IsOptional()
    status?: "pending" | "insufficient" | "approved" | "rejected";
}
