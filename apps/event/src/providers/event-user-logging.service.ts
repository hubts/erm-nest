import { Injectable } from "@nestjs/common";
import { EventUserLoggingRepository } from "../repositories";
import {
    CreateEventUserLoggingInput,
    FindAllEventUserLoggingsQuery,
} from "@app/sdk";
import { EventUserLoggingMapper } from "../mapper";

@Injectable()
export class EventUserLoggingService {
    constructor(
        private readonly eventUserLoggingRepo: EventUserLoggingRepository
    ) {}

    async create(input: CreateEventUserLoggingInput) {
        const { userId, fieldName, value } = input;
        const eventUserLogging = await this.eventUserLoggingRepo.create({
            userId,
            fieldName,
            value,
        });
        return EventUserLoggingMapper.toModel(eventUserLogging);
    }

    async findAll(query: FindAllEventUserLoggingsQuery) {
        const {
            skip,
            take,
            startedAt,
            endedAt,
            userId,
            fieldName,
            fieldNames,
        } = query;
        const eventUserLoggings = await this.eventUserLoggingRepo.findPaginated(
            {
                ...(startedAt ? { startedAt: { $gte: startedAt } } : {}),
                ...(endedAt ? { endedAt: { $lte: endedAt } } : {}),
                ...(userId ? { userId } : {}),
                ...(fieldName ? { fieldName } : {}),
                ...(fieldNames && fieldNames.length
                    ? { fieldName: { $in: fieldNames } }
                    : {}),
            },
            { skip, take }
        );
        return eventUserLoggings.map(EventUserLoggingMapper.toModel);
    }
}
