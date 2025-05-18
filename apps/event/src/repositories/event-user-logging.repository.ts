import { AbstractRepository } from "@app/common";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { EventUserLogging } from "../schemas";

@Injectable()
export class EventUserLoggingRepository extends AbstractRepository<EventUserLogging> {
    constructor(
        @InjectModel(EventUserLogging.name)
        eventUserLoggingModel: Model<EventUserLogging>
    ) {
        super(eventUserLoggingModel);
    }
}
