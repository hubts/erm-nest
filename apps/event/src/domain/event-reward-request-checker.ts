import { DateUtil } from "@app/common";
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
        const type = conditionModel.type;

        // fieldName이 일치하는 로깅 필터링
        const relevantLoggings = eventUserLoggings.filter(
            logging => logging.fieldName === conditionModel.fieldName
        );

        // 로깅이 없는 경우 처리
        if (relevantLoggings.length === 0) return false;

        // 각 로깅에 대해 조건 검사
        return relevantLoggings.some(logging => {
            const value =
                type === "number"
                    ? Number(logging.value)
                    : type === "date"
                    ? new Date(logging.value)
                    : logging.value;
            const condition =
                type === "number"
                    ? Number(set.rightOperand)
                    : type === "date"
                    ? new Date(set.rightOperand)
                    : set.rightOperand;

            switch (set.operator) {
                case "eq":
                    if (type === "date") {
                        // Date 타입인 경우 동일한 날짜인지 확인 (시간 무시)
                        return DateUtil.isSameDay(
                            new Date(value),
                            new Date(condition)
                        );
                    } else {
                        // 숫자/문자열 타입인 경우 동일한 값인지 확인
                        return value === condition;
                    }
                case "neq":
                    if (type === "date") {
                        // Date 타입인 경우 다른 날짜인지 확인 (시간 무시)
                        return !DateUtil.isSameDay(
                            new Date(value),
                            new Date(condition)
                        );
                    } else {
                        // 숫자/문자열 타입인 경우 다른 값인지 확인
                        return value !== condition;
                    }
                case "gt":
                    if (
                        typeof value === "number" &&
                        typeof condition === "number"
                    ) {
                        // 숫자 타입인 경우 크기 비교
                        return value > condition;
                    } else if (type === "date") {
                        // Date 타입인 경우 이후 날짜인지 확인
                        return DateUtil.isAfter(
                            new Date(value),
                            new Date(condition)
                        );
                    } else {
                        // 문자열 비교 불가능
                        return false;
                    }
                case "lt":
                    if (
                        typeof value === "number" &&
                        typeof condition === "number"
                    ) {
                        // 숫자 타입인 경우 크기 비교
                        return value < condition;
                    } else if (type === "date") {
                        // Date 타입인 경우 이전 날짜인지 확인
                        return DateUtil.isBefore(
                            new Date(value),
                            new Date(condition)
                        );
                    } else {
                        // 문자열 비교 불가능
                        return false;
                    }
                case "gte":
                    if (
                        typeof value === "number" &&
                        typeof condition === "number"
                    ) {
                        // 숫자 타입인 경우 크기 비교
                        return value >= condition;
                    } else if (type === "date") {
                        // Date 타입인 경우 이후거나 같은 날짜인지 확인
                        return DateUtil.isAfterOrEqual(
                            new Date(value),
                            new Date(condition)
                        );
                    } else {
                        return false;
                    }
                case "lte":
                    if (
                        typeof value === "number" &&
                        typeof condition === "number"
                    ) {
                        // 숫자 타입인 경우 크기 비교
                        return value <= condition;
                    } else if (type === "date") {
                        // Date 타입인 경우 이전이거나 같은 날짜인지 확인
                        return DateUtil.isBeforeOrEqual(
                            new Date(value),
                            new Date(condition)
                        );
                    } else {
                        // 문자열 비교 불가능
                        return false;
                    }
                case "in":
                    // 배열 입력 포함 시
                    // return (
                    //     Array.isArray(condition) && condition.includes(value)
                    // );
                    return false;
                case "nin":
                    // 배열 입력 포함 시
                    // return (
                    //     Array.isArray(condition) && !condition.includes(value)
                    // );
                    return false;
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
