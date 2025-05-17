import { Inject, Injectable } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import {
    ClientProvider,
    ClientsModuleOptionsFactory,
    Transport,
} from "@nestjs/microservices";
import { EventServiceConfig } from "./event-service.config";

@Injectable()
export class EventServiceConfigService implements ClientsModuleOptionsFactory {
    private config: ConfigType<typeof EventServiceConfig>;

    constructor(
        @Inject(EventServiceConfig.KEY)
        config: ConfigType<typeof EventServiceConfig>
    ) {
        this.config = config;
    }

    createClientOptions(): ClientProvider {
        return {
            transport: Transport.TCP,
            options: {
                host: this.config.host,
                port: this.config.port,
            },
        };
    }
}
