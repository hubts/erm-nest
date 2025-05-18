import { EventUserLoggingModel } from "@app/sdk";
import { EventUserLogging } from "../schemas";

export const EventUserLoggingMapper = {
    toModel: (eventUserLogging: EventUserLogging): EventUserLoggingModel => {
        return {
            id: eventUserLogging._id.toString(),
            userId: eventUserLogging.userId,
            loggedAt: eventUserLogging.createdAt,
            fieldName: eventUserLogging.fieldName,
            value: eventUserLogging.value,
            metadata: eventUserLogging.metadata,
        };
    },
};
