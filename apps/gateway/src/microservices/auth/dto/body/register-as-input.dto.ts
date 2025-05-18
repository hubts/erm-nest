import { RegisterAsInput, UserRole } from "@app/sdk";
import { ApiProperty, PickType } from "@nestjs/swagger";
import { RegisterInputDto } from "./register-input.dto";
import { IsEnum, IsNotEmpty } from "class-validator";

export class RegisterAsInputDto
    extends PickType(RegisterInputDto, ["email", "password"])
    implements RegisterAsInput
{
    @ApiProperty({
        description: "역할",
        example: UserRole.OPERATOR,
        enum: UserRole,
        enumName: "UserRole",
    })
    @IsNotEmpty()
    @IsEnum(UserRole)
    role: UserRole;
}
