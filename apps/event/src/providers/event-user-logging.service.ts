import { Injectable } from "@nestjs/common";
import { EventUserLoggingRepository } from "../repositories";
import {
    CreateEventUserLoggingInput,
    EventUserLoggingModel,
    FindAllEventUserLoggingsQuery,
    Paginated,
} from "@app/sdk";
import { EventUserLoggingMapper } from "../mapper";
import { EventUserLogging } from "../schemas";
import { FilterQuery } from "mongoose";

@Injectable()
export class EventUserLoggingService {
    constructor(
        private readonly eventUserLoggingRepo: EventUserLoggingRepository
    ) {}

    // Create event user logging (called by external services, such as login, register, friend invite, etc.)
    async create(input: CreateEventUserLoggingInput) {
        const { userId, fieldName, value } = input;
        const eventUserLogging = await this.eventUserLoggingRepo.create({
            userId,
            fieldName,
            value,
        });
        return EventUserLoggingMapper.toModel(eventUserLogging);
    }

    // Find all event user loggings
    async findAll(
        query: FindAllEventUserLoggingsQuery
    ): Promise<Paginated<EventUserLoggingModel>> {
        const {
            skip,
            take,
            startedAt,
            endedAt,
            userId,
            fieldName,
            fieldNames,
        } = query;

        // Query
        const filter: FilterQuery<EventUserLogging> = {};
        if (startedAt && endedAt) {
            filter.createdAt = {
                $gte: new Date(startedAt),
                $lte: new Date(endedAt),
            };
        } else if (startedAt) {
            filter.createdAt = { $gte: new Date(startedAt) };
        } else if (endedAt) {
            filter.createdAt = { $lte: new Date(endedAt) };
        }
        if (userId) {
            filter.userId = userId;
        }
        if (fieldName) {
            filter.fieldName = fieldName;
        }
        if (fieldNames && fieldNames.length) {
            filter.fieldName = { $in: fieldNames };
        }

        // Find
        const total = await this.eventUserLoggingRepo.count(filter);
        const list = await this.eventUserLoggingRepo.findAllPaginated(filter, {
            skip,
            take,
        });
        return {
            total,
            size: list.length,
            list: list.map(EventUserLoggingMapper.toModel),
        };
    }
}
