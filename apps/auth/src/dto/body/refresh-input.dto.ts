import { RefreshInput } from "@app/sdk";
import { faker } from "@faker-js/faker";
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class RefreshInputDto implements RefreshInput {
    @ApiProperty({
        description: "Refresh Token",
        example: faker.string.hexadecimal({ length: 32 }),
    })
    @IsNotEmpty()
    @IsString()
    refreshToken: string;
}
