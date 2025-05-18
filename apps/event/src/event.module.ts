import { APP_FILTER, APP_INTERCEPTOR } from "@nestjs/core";
import { Logger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { EventService } from "./providers/event.service";
import { CONFIGURATIONS } from "../config/configuration";
import { MongooseConfigService } from "../config/mongoose.config.service";
import { EventRepository } from "./repositories/event.repository";
import { DefaultIfEmptyInterceptor, RpcErrorFilter } from "@app/common";
import { EventRpcHandler } from "./event.rpc-handler";
import {
    Event,
    EventSchema,
    EventCondition,
    EventConditionSchema,
    EventRewardRequest,
    EventRewardRequestSchema,
    EventUserLogging,
    EventUserLoggingSchema,
} from "./schemas";
import {
    EventConditionService,
    EventRewardRequestService,
    EventUserLoggingService,
} from "./providers";
import {
    EventConditionRepository,
    EventRewardRequestRepository,
    EventUserLoggingRepository,
} from "./repositories";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: CONFIGURATIONS,
            envFilePath: "./apps/event/.env",
        }),
        MongooseModule.forRootAsync({
            useClass: MongooseConfigService,
        }),
        MongooseModule.forFeature([
            { name: Event.name, schema: EventSchema },
            { name: EventCondition.name, schema: EventConditionSchema },
            { name: EventRewardRequest.name, schema: EventRewardRequestSchema },
            { name: EventUserLogging.name, schema: EventUserLoggingSchema },
        ]),
    ],
    controllers: [EventRpcHandler],
    providers: [
        Logger,
        EventService,
        EventRepository,
        EventConditionService,
        EventConditionRepository,
        EventRewardRequestService,
        EventRewardRequestRepository,
        EventUserLoggingService,
        EventUserLoggingRepository,
        {
            provide: APP_INTERCEPTOR,
            useClass: DefaultIfEmptyInterceptor,
        },
        {
            provide: APP_FILTER,
            useClass: RpcErrorFilter,
        },
    ],
})
export class EventModule {}
