import {
    EventConditionModel,
    EventConditionOperator,
    EventConditionSet,
    EventConditionGroup,
    LogicalOperator,
} from "@app/sdk";

export class EventConditionValidator {
    // Validation 메인 함수
    static validate(
        group: any,
        availableConditions: EventConditionModel[]
    ): boolean {
        if (!this.isEventConditionGroup(group)) {
            return false;
        }

        // 조건 배열 검증
        return group.conditions.every(condition => {
            if (this.isEventConditionSet(condition)) {
                const model = availableConditions.find(
                    m => m.id === condition.leftOperand.id
                );
                if (!model) {
                    return false;
                }

                // check type match
                const right = condition.rightOperand;
                if (model.type === "string" && typeof right !== "string")
                    return false;
                if (model.type === "number" && typeof right !== "number")
                    return false;
                if (model.type === "date" && !(right instanceof Date))
                    return false;

                return true;
            }

            if (this.isEventConditionGroup(condition)) {
                return this.validate(condition, availableConditions);
            }

            return false;
        });
    }

    // 이벤트 결합 연산자
    // 1. 오브젝트여야 하고,
    // 2. 올바른 연산자가 존재해야 한다.
    private static isLogicalOperator(value: any): value is LogicalOperator {
        return Object.values(LogicalOperator).includes(
            value as LogicalOperator
        );
    }

    // 이벤트 조건 연산자
    // 1. 오브젝트여야 하고,
    // 2. 올바른 연산자가 존재해야 한다.
    private static isEventConditionOperator(
        value: any
    ): value is EventConditionOperator {
        return Object.values(EventConditionOperator).includes(value);
    }

    // 이벤트 조건 세트
    // 1. 오브젝트여야 하고,
    // 2. 올바른 연산자가 존재하고,
    // 3. 올바른 타입의 오퍼랜드가 존재해야 한다.
    private static isEventConditionSet(obj: any): obj is EventConditionSet {
        return (
            obj &&
            typeof obj === "object" &&
            obj.leftOperand?.id &&
            this.isEventConditionOperator(obj.operator) &&
            (typeof obj.rightOperand === "string" ||
                typeof obj.rightOperand === "number" ||
                obj.rightOperand instanceof Date)
        );
    }

    // 이벤트 조건 그룹 검증
    // 1. 오브젝트여야 하고,
    // 2. 올바른 연산자가 존재하고,
    // 3. 조건 배열이 존재해야 한다.
    private static isEventConditionGroup(obj: any): obj is EventConditionGroup {
        return (
            obj &&
            typeof obj === "object" &&
            this.isLogicalOperator(obj.operator) &&
            Array.isArray(obj.conditions)
        );
    }
}
