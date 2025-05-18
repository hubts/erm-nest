import { generateId } from "@app/common";
import { CreateEventUserLoggingInput } from "@app/sdk";
import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty } from "class-validator";

export class CreateEventUserLoggingInputDto
    implements CreateEventUserLoggingInput
{
    @ApiProperty({
        description: "사용자 ID",
        example: generateId(),
    })
    @IsString()
    @IsNotEmpty()
    userId: string;

    @ApiProperty({
        description: "이벤트 조건 필드명",
        example: "login_streak",
    })
    @IsString()
    @IsNotEmpty()
    fieldName: string;

    @ApiProperty({
        description: "발생 값",
        example: 1,
    })
    @IsNotEmpty()
    value: string | number | Date;
}
