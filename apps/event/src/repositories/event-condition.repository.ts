import { AbstractRepository } from "@app/common";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { EventCondition } from "../schemas";

@Injectable()
export class EventConditionRepository extends AbstractRepository<EventCondition> {
    constructor(
        @InjectModel(EventCondition.name)
        eventConditionModel: Model<EventCondition>
    ) {
        super(eventConditionModel);
    }
}
