import { EventRewardRequestModel } from "@app/sdk";
import { EventRewardRequest } from "../schemas";

export const EventRewardRequestMapper = {
    toModel: (
        eventRewardRequest: EventRewardRequest
    ): EventRewardRequestModel => {
        return {
            id: eventRewardRequest._id.toString(),
            createdAt: eventRewardRequest.createdAt,
            updatedAt: eventRewardRequest.updatedAt,
            eventId: eventRewardRequest.event.id,
            userId: eventRewardRequest.user.id,
            status: eventRewardRequest.status,
            reason: eventRewardRequest.reason,
            determinedAt: eventRewardRequest.determinedAt,
            determinedBy: eventRewardRequest.determinedBy,
            receivedRewards: eventRewardRequest.receivedRewards ?? [],
            eventUserLoggings: eventRewardRequest.eventUserLoggings ?? [],
        };
    },
};
