import { PaginationQuery, ServiceToApi } from "@app/sdk";
import { UserModel } from "../auth";
import {
    EventConditionModel,
    EventModel,
    EventRewardModel,
    EventRewardRequestModel,
    EventUserLoggingModel,
} from "./event.model";

/**
 * 이벤트 API 인터페이스
 * @summary EventService 구현 시 이용
 */
export interface EventApi<
    R extends UserModel | string | undefined = undefined
> {
    /**
     * Events
     */
    // Create
    create(requestor: R, input: CreateEventInput): Promise<void>;
    // Update
    update(requestor: R, id: string, input: UpdateEventInput): Promise<void>;
    // Find one
    findOne(requestor: R, id: string): Promise<EventModel>;
    // Find all (via query)
    findAll(requestor: R, query: FindAllEventsQuery): Promise<EventModel[]>;

    /**
     * Event condition
     */
    // Create a condition type
    createEventCondition(
        requestor: R,
        input: CreateEventConditionInput
    ): Promise<void>;
    // Find all condition types
    findAllEventConditions(
        requestor: R,
        query: FindAllEventConditionsQuery
    ): Promise<EventConditionModel[]>;

    /**
     * Rewards
     */
    // Set a rewards
    settingRewards(
        requestor: R,
        eventId: string,
        input: SettingRewardsInput
    ): Promise<void>;

    /**
     * Reward Requests
     */
    // Request an event reward
    requestReward(requestor: R, eventId: string): Promise<void>;
    // Approve a reward request
    approveRewardRequest(requestor: R, rewardRequestId: string): Promise<void>;
    // Reject a reward request
    rejectRewardRequest(
        requestor: R,
        rewardRequestId: string,
        input: RejectRewardRequestInput
    ): Promise<void>;
    // Find one reward request
    findOneRewardRequest(
        requestor: R,
        rewardRequestId: string
    ): Promise<EventRewardRequestModel>;
    // Find all reward requests
    findAllRewardRequests(
        requestor: R,
        query: FindAllRewardRequestsQuery
    ): Promise<EventRewardRequestModel[]>;

    /**
     * TEST: Event User Logging
     */
    // Log a user's event participation
    createEventUserLogging(input: CreateEventUserLoggingInput): Promise<void>;
    // Find all event user loggings
    findAllEventUserLoggings(
        requestor: R,
        query: FindAllEventUserLoggingsQuery
    ): Promise<EventUserLoggingModel[]>;
}
export type IEventService = EventApi<UserModel>;
export type IEventController = ServiceToApi<EventApi<UserModel>>;

// 이벤트 생성 입력
export interface CreateEventInput
    extends Pick<
        EventModel,
        | "name"
        | "description"
        | "startedAt"
        | "endedAt"
        | "condition"
        | "rewardDistributionType"
        | "rewards"
    > {}

// 이벤트 업데이트 입력
export interface UpdateEventInput extends Partial<CreateEventInput> {}

// 이벤트 조회 쿼리
export interface FindAllEventsQuery
    extends PaginationQuery,
        Partial<
            Pick<EventModel, "startedAt" | "endedAt" | "name" | "status">
        > {}

// 이벤트 보상 입력
export interface SettingRewardsInput {
    rewards: (Pick<EventRewardModel, "name" | "type" | "amount"> & {
        id?: string;
    })[];
}

// 이벤트 보상 요청 거절 입력
export interface RejectRewardRequestInput
    extends Pick<EventRewardRequestModel, "reason"> {}

// 이벤트 보상 요청 조회 쿼리
export interface FindAllRewardRequestsQuery
    extends PaginationQuery,
        Partial<
            Pick<EventRewardRequestModel, "eventId" | "userId" | "status">
        > {}

// 이벤트 조건 생성 입력
export interface CreateEventConditionInput
    extends Pick<EventConditionModel, "fieldName" | "displayName" | "type"> {}

// 이벤트 조건 조회 쿼리
export interface FindAllEventConditionsQuery
    extends PaginationQuery,
        Pick<EventConditionModel, "displayName"> {}

// 이벤트 사용자 로깅 생성 입력
export interface CreateEventUserLoggingInput
    extends Pick<EventUserLoggingModel, "userId" | "fieldName" | "value"> {}

// 이벤트 사용자 로깅 조회 쿼리
export interface FindAllEventUserLoggingsQuery
    extends PaginationQuery,
        Pick<EventUserLoggingModel, "userId" | "fieldName"> {
    startedAt?: Date;
    endedAt?: Date;
}
