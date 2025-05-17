import { AbstractRepository } from "@app/common";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Event } from "../schemas/event.schema";

@Injectable()
export class EventRepository extends AbstractRepository<Event> {
    constructor(
        @InjectModel(Event.name)
        private readonly eventModel: Model<Event>
    ) {
        super(eventModel);
    }
}
