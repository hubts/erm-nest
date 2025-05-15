import { ApiProperty } from "@nestjs/swagger";
import { CommonResponse } from "@app/sdk";

export class CommonResponseDto<T = null> implements CommonResponse<T> {
    @ApiProperty({
        description: "The success of the request",
        example: true,
    })
    success: boolean;

    @ApiProperty({
        description: "The message of the request",
        example: "Success",
    })
    message: string;

    @ApiProperty({
        description: "The data of the request",
        example: null,
        nullable: true,
    })
    data: T | null;
}
