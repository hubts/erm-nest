import { registerAs } from "@nestjs/config";
import { Configuration } from "./configuration";
import { ConfigValidation, NotEmptyString } from "@app/common";

export const MongooseConfig = registerAs(
    "mongoose",
    (): Configuration["Mongoose"] => {
        const config = new MongooseConfigValidation();
        return {
            uri: config.MONGO_DB_URL,
        };
    }
);

@ConfigValidation()
class MongooseConfigValidation {
    @NotEmptyString()
    MONGO_DB_URL: string;
}
