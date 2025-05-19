import { generateId } from "@app/common";
import { CreateRewardInput } from "@app/sdk";
import { EventRewardModel } from "@app/sdk";

export const RewardMapper = {
    createToModel: (input: CreateRewardInput): EventRewardModel => {
        return {
            id: generateId(),
            name: input.name,
            type: input.type,
            amount: input.amount,
        };
    },
};
