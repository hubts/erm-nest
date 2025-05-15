/* eslint-disable @typescript-eslint/no-inferrable-types */
import { PaginationQuery } from "@app/sdk";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, Min } from "class-validator";

export class PaginationQueryDto implements PaginationQuery {
    @ApiProperty({
        description: "The number of items to skip",
        required: false,
        example: 0,
    })
    @IsNumber()
    @IsNotEmpty()
    @Min(0)
    @Type(() => Number)
    skip: number = 0;

    @ApiProperty({
        description: "The number of items to take",
        required: false,
        example: 10,
    })
    @IsNumber()
    @IsNotEmpty()
    @Min(1)
    @Type(() => Number)
    take: number = 10;
}
