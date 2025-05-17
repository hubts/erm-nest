import { Module } from "@nestjs/common";
import { EventController } from "./event.controller";
import { EventService } from "./event.service";
import { ConfigModule } from "@nestjs/config";
import { CONFIGURATIONS } from "../config/configuration";
import { MongooseConfigService } from "../config/mongoose.config.service";
import { MongooseModule } from "@nestjs/mongoose";
import { EventSchema } from "./schemas/event.schema";
import { EventRepository } from "./repositories/event.repository";
import { EventManagementService } from "./providers/event-management.service";

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
        MongooseModule.forFeature([{ name: Event.name, schema: EventSchema }]),
    ],
    controllers: [EventController],
    providers: [EventService, EventRepository, EventManagementService],
})
export class EventModule {}
