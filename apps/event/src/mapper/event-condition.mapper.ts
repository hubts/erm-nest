import { EventConditionModel } from "@app/sdk";
import { EventCondition } from "../schemas";

export const EventConditionMapper = {
    toModel: (eventCondition: EventCondition): EventConditionModel => {
        return {
            id: eventCondition._id.toString(),
            fieldName: eventCondition.fieldName,
            displayName: eventCondition.displayName,
            type: eventCondition.type,
            createdAt: eventCondition.createdAt,
            createdBy: eventCondition.createdBy,
        };
    },
};
