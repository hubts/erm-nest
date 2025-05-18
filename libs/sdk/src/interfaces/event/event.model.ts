/**
 * 이벤트 모델
 * 이벤트 참여 조건, 지급 보상 등을 정의하는 모델
 */
export interface EventModel {
    id: string;
    createdAt: Date;
    createdBy: string;
    updatedAt: Date;
    updatedBy: string;
    name: string;
    description: string;
    status: "active" | "inactive";
    startedAt: Date;
    endedAt: Date;
    condition: EventConditionGroup;
    rewardDistributionType: "manual" | "auto";
    rewards: EventRewardModel[];
}

// 이벤트 조건 그룹
export interface EventConditionGroup {
    operator: LogicalOperator;
    conditions: (EventConditionSet | EventConditionGroup)[];
}

// 이벤트 조건 그룹 연산자
export const LogicalOperator = {
    AND: "and",
    OR: "or",
} as const;
export type LogicalOperator =
    (typeof LogicalOperator)[keyof typeof LogicalOperator];

// 이벤트 조건 세트
export interface EventConditionSet {
    leftOperand: Pick<EventConditionModel, "id">;
    operator: EventConditionOperator;
    rightOperand: string | number | Date;
}

/**
 * 이벤트 조건 모델
 * 이벤트 참여 조건을 정의하는 모델
 */
export interface EventConditionModel {
    id: string;
    fieldName: string;
    displayName: string;
    type: "string" | "number" | "date";
    createdAt: Date;
    createdBy: string;
}

// 이벤트 조건 연산자
export const EventConditionOperator = {
    EQUAL: "eq",
    NOT_EQUAL: "neq",
    GREATER_THAN: "gt",
    LESS_THAN: "lt",
    GREATER_THAN_OR_EQUAL: "gte",
    LESS_THAN_OR_EQUAL: "lte",
    IN: "in",
    NOT_IN: "nin",
    EXISTS: "exists",
    IS_NULL: "isNull",
    IS_NOT_NULL: "isNotNull",
} as const;
export type EventConditionOperator =
    (typeof EventConditionOperator)[keyof typeof EventConditionOperator];

/**
 * 이벤트 보상 요청 모델
 * 이벤트 참여 후 보상을 요청하는 모델
 */
export interface EventRewardRequestModel {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    eventId: string;
    userId: string;
    status: "pending" | "insufficient" | "approved" | "rejected";
    reason?: string;
    determinedAt: Date;
    determinedBy: string;
    receivedRewards: EventRewardModel[];
    eventUserLoggings: EventUserLoggingModel[];
}

/**
 * 이벤트 보상 모델
 * e.g. 포인트, 쿠폰, 아이템 등
 */
export interface EventRewardModel {
    id: string;
    name: string;
    type: "cash" | "point" | "coupon" | "item";
    amount: number;
}

/**
 * 이벤트와 관련된 유저 행동을 로깅하는 모델
 * e.g. 로그인(출석), 가입, 초대 등 EventConditionModel에 정의된 필드에 대한 로깅
 * ! 유저의 이벤트 참여 로깅은 별도 기능 호출로 누적된다고 가정
 */
export interface EventUserLoggingModel {
    id: string;
    userId: string;
    loggedAt: Date;
    fieldName: string;
    value: string | number | Date;
    metadata?: Record<string, any>;
}
