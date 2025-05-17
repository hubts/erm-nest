import { ConfigValidation, NotEmptyString } from "@app/common";
import { registerAs } from "@nestjs/config";
import { Configuration } from "./configuration";

export const JwtConfig = registerAs("jwt", (): Configuration["Jwt"] => {
    const config = new JwtConfigValidation();
    return {
        publicKey: config.JWT_PUBLIC_KEY.replace(/\\n/gm, "\n").replace(
            /\"/gm,
            ""
        ),
    };
});

@ConfigValidation()
class JwtConfigValidation {
    @NotEmptyString()
    JWT_PUBLIC_KEY: string;
}
