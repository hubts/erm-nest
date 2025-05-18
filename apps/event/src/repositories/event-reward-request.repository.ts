import { AbstractRepository } from "@app/common";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { EventRewardRequest } from "../schemas";

@Injectable()
export class EventRewardRequestRepository extends AbstractRepository<EventRewardRequest> {
    constructor(
        @InjectModel(EventRewardRequest.name)
        eventRewardRequestModel: Model<EventRewardRequest>
    ) {
        super(eventRewardRequestModel);
    }
}
