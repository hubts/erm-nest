import { AuthToken } from "@app/sdk";
import { ApiProperty } from "@nestjs/swagger";
import { faker } from "@faker-js/faker";

export class AuthTokenDto implements AuthToken {
    @ApiProperty({
        description: "Access Token",
        example: faker.string.hexadecimal({ length: 32 }),
    })
    accessToken: string;

    @ApiProperty({
        description: "Refresh Token",
        example: faker.string.hexadecimal({ length: 32 }),
    })
    refreshToken: string;
}
