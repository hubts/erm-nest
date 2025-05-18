import { FindAllEventUserLoggingsQuery } from "@app/sdk";
import { PaginationQueryDto } from "@app/common";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsString, IsOptional, IsDateString, IsArray } from "class-validator";
import { faker } from "@faker-js/faker";

export class FindAllEventUserLoggingsQueryDto
    extends PaginationQueryDto
    implements FindAllEventUserLoggingsQuery
{
    @ApiPropertyOptional({
        description: "시작 시간",
    })
    @IsDateString()
    @IsOptional()
    startedAt?: Date;

    @ApiPropertyOptional({
        description: "종료 시간",
    })
    @IsDateString()
    @IsOptional()
    endedAt?: Date;

    @ApiPropertyOptional({
        description: "이벤트 조건 필드명",
        example: "login_streak",
    })
    @IsString()
    @IsOptional()
    fieldName?: string;

    @ApiPropertyOptional({
        description: "사용자 ID",
        example: faker.string.uuid(),
    })
    @IsString()
    @IsOptional()
    userId?: string;

    @ApiPropertyOptional({
        description: "이벤트 조건 필드명",
        example: ["login_streak", "login_count"],
    })
    @IsArray()
    @IsOptional()
    fieldNames?: string[];
}
