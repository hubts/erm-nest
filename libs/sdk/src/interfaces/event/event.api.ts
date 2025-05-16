import { PaginationQuery, ServiceToApi } from "@app/sdk";
import { UserModel } from "../auth";
import {
    EventModel,
    EventRewardModel,
    EventRewardRequestModel,
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
