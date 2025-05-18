import { EventConditionGroup } from "@app/sdk";

export function extractLeftOperandIds(group: EventConditionGroup): string[] {
    const ids: string[] = [];

    for (const condition of group.conditions) {
        if ("leftOperand" in condition && condition.leftOperand?.id) {
            ids.push(condition.leftOperand.id);
        } else if ("conditions" in condition) {
            ids.push(...extractLeftOperandIds(condition));
        }
    }

    return ids;
}
