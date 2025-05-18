import {
    EventConditionGroup,
    EventConditionModel,
    EventConditionSet,
    EventUserLoggingModel,
} from "@app/sdk";

export function checkEventRewardRequest(
    eventCondition: EventConditionGroup,
    eventConditions: EventConditionModel[],
    eventUserLoggings: EventUserLoggingModel[]
): boolean {
    // 재귀적으로 조건 그룹을 검사하는 함수
    function checkConditionGroup(
        group: EventConditionGroup,
        eventConditions: EventConditionModel[],
        eventUserLoggings: EventUserLoggingModel[]
    ): boolean {
        // 각 조건의 결과를 저장할 배열
        const results: boolean[] = [];

        // 그룹 내 모든 조건을 검사
        for (const condition of group.conditions) {
            if (
                "leftOperand" in condition &&
                "operator" in condition &&
                "rightOperand" in condition
            ) {
                // 조건이 Set인 경우 개별 조건 검사
                results.push(
                    checkConditionSet(
                        condition,
                        eventConditions,
                        eventUserLoggings
                    )
                );
            } else {
                // 조건이 그룹인 경우 재귀적으로 검사
                results.push(
                    checkConditionGroup(
                        condition,
                        eventConditions,
                        eventUserLoggings
                    )
                );
            }
        }

        // LogicalOperator에 따라 최종 결과 반환
        return group.operator === "and"
            ? results.every(result => result)
            : results.some(result => result);
    }

    // 개별 조건 Set을 검사하는 함수
    function checkConditionSet(
        set: EventConditionSet,
        eventConditions: EventConditionModel[],
        eventUserLoggings: EventUserLoggingModel[]
    ): boolean {
        // 해당 조건 모델 찾기
        const conditionModel = eventConditions.find(
            condition => condition.id === set.leftOperand.id
        );
        if (!conditionModel) return false;

        // fieldName이 일치하는 로깅 필터링
        const relevantLoggings = eventUserLoggings.filter(
            logging => logging.fieldName === conditionModel.fieldName
        );

        // 로깅이 없는 경우 처리
        if (relevantLoggings.length === 0) return false;

        // 각 로깅에 대해 조건 검사
        return relevantLoggings.some(logging => {
            const value = logging.value;
            const condition = set.rightOperand;

            switch (set.operator) {
                case "eq":
                    return value === condition;
                case "neq":
                    return value !== condition;
                case "gt":
                    return value > condition;
                case "lt":
                    return value < condition;
                case "gte":
                    return value >= condition;
                case "lte":
                    return value <= condition;
                case "in":
                    return (
                        Array.isArray(condition) && condition.includes(value)
                    );
                case "nin":
                    return (
                        Array.isArray(condition) && !condition.includes(value)
                    );
                case "exists":
                    return value !== undefined && value !== null;
                case "isNull":
                    return value === null;
                case "isNotNull":
                    return value !== null;
                default:
                    return false;
            }
        });
    }

    // 메인 함수 실행
    return checkConditionGroup(
        eventCondition,
        eventConditions,
        eventUserLoggings
    );
}
