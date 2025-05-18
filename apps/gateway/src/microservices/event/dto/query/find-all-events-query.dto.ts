import { FindAllEventsQuery } from "@app/sdk";
import { PaginationQueryDto } from "@app/common";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsString, IsOptional, IsIn, IsDateString } from "class-validator";

export class FindAllEventsQueryDto
    extends PaginationQueryDto
    implements FindAllEventsQuery
{
    @ApiPropertyOptional({
        description: "이벤트명",
    })
    @IsString()
    @IsOptional()
    name?: string;

    @ApiPropertyOptional({
        description: "이벤트 상태",
        enum: ["active", "inactive"],
    })
    @IsIn(["active", "inactive"])
    @IsOptional()
    status?: "active" | "inactive";

    @ApiPropertyOptional({
        description: "이벤트 시작 시간",
    })
    @IsDateString()
    @IsOptional()
    startedAt?: Date;

    @ApiPropertyOptional({
        description: "이벤트 종료 시간",
    })
    @IsDateString()
    @IsOptional()
    endedAt?: Date;
}
