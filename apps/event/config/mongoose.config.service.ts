import { Inject, Injectable } from "@nestjs/common";
import {
    MongooseModuleOptions,
    MongooseOptionsFactory,
} from "@nestjs/mongoose";
import { MongooseConfig } from "./mongoose.config";
import { ConfigType } from "@nestjs/config";

@Injectable()
export class MongooseConfigService implements MongooseOptionsFactory {
    private config: ConfigType<typeof MongooseConfig>;

    constructor(
        @Inject(MongooseConfig.KEY)
        config: ConfigType<typeof MongooseConfig>
    ) {
        this.config = config;
    }

    createMongooseOptions():
        | Promise<MongooseModuleOptions>
        | MongooseModuleOptions {
        return {
            uri: this.config.uri,
        };
    }
}
