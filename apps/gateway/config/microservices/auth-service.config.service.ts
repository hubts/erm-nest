import { Inject, Injectable } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import {
    ClientProvider,
    ClientsModuleOptionsFactory,
    Transport,
} from "@nestjs/microservices";
import { AuthServiceConfig } from "./auth-service.config";

@Injectable()
export class AuthServiceConfigService implements ClientsModuleOptionsFactory {
    private config: ConfigType<typeof AuthServiceConfig>;

    constructor(
        @Inject(AuthServiceConfig.KEY)
        config: ConfigType<typeof AuthServiceConfig>
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
