import { EventModel } from "@app/sdk";
import { Event } from "../schemas/event.schema";

export const EventMapper = {
    toModel: (event: Event): EventModel => {
        return {
            id: event._id.toString(),
            createdAt: event.createdAt,
            createdBy: event.createdBy,
            updatedAt: event.updatedAt,
            updatedBy: event.updatedBy,
            name: event.name,
            description: event.description,
            status: event.status,
            startedAt: event.startedAt,
            endedAt: event.endedAt,
            condition: event.condition,
            rewardDistributionType: event.rewardDistributionType,
            rewards: event.rewards,
        };
    },
};
