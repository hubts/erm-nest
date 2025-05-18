import { CreateEventConditionInput } from "@app/sdk";
import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsIn } from "class-validator";

export class CreateEventConditionInputDto implements CreateEventConditionInput {
    @ApiProperty({
        description: "이벤트 조건 필드명",
        example: "login_streak",
    })
    @IsString()
    @IsNotEmpty()
    fieldName: string;

    @ApiProperty({
        description: "이벤트 조건 이름",
        example: "로그인 연속 일수",
    })
    @IsString()
    @IsNotEmpty()
    displayName: string;

    @ApiProperty({
        description: "이벤트 조건 타입",
        enum: ["number", "date", "string"],
    })
    @IsIn(["number", "date", "string"])
    @IsNotEmpty()
    type: "string" | "number" | "date";
}
