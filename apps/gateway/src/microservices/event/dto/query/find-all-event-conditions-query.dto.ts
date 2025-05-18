import { PaginationQueryDto } from "@app/common";
import { FindAllEventConditionsQuery } from "@app/sdk";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsString, IsOptional } from "class-validator";

export class FindAllEventConditionsQueryDto
    extends PaginationQueryDto
    implements FindAllEventConditionsQuery
{
    @ApiPropertyOptional({
        description: "이벤트 조건 이름",
        example: "로그인",
    })
    @IsString()
    @IsOptional()
    displayName?: string;
}
