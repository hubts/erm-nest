import {
    ConfigValidation,
    NotEmptyIntRange,
    NotEmptyString,
} from "@app/common";
import { registerAs } from "@nestjs/config";
import { Configuration } from "../configuration";

export const EventServiceConfig = registerAs(
    "event-service",
    (): Configuration["Microservices"]["Event"] => {
        const config = new EventServiceConfigValidation();
        return {
            host: config.MS_EVENT_SERVICE_HOST,
            port: config.MS_EVENT_SERVICE_PORT,
        };
    }
);

@ConfigValidation()
class EventServiceConfigValidation {
    @NotEmptyString()
    MS_EVENT_SERVICE_HOST: string;

    @NotEmptyIntRange(0, 65535)
    MS_EVENT_SERVICE_PORT: number;
}
