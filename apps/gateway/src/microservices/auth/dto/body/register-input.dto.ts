import { RegisterInput } from "@app/sdk";
import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { faker } from "@faker-js/faker";

export class RegisterInputDto implements RegisterInput {
    @ApiProperty({
        description: "이메일",
        example: faker.internet.email(),
    })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({
        description: "비밀번호",
        example: faker.internet.password(),
    })
    @IsString()
    @IsNotEmpty()
    password: string;

    @ApiProperty({
        description: "닉네임",
        example: faker.person.firstName(),
    })
    @IsString()
    @IsNotEmpty()
    nickname: string;
}
