import { Injectable } from "@nestjs/common";
import { EventManagementService } from "./providers/event-management.service";
import {
    CreateEventConditionInput,
    CreateEventInput,
    CreateEventUserLoggingInput,
    EventConditionModel,
    EventModel,
    EventRewardRequestModel,
    EventUserLoggingModel,
    FindAllEventConditionsQuery,
    FindAllEventsQuery,
    FindAllEventUserLoggingsQuery,
    FindAllRewardRequestsQuery,
    IEventService,
    RejectRewardRequestInput,
    SettingRewardsInput,
    UpdateEventInput,
    UserModel,
} from "@app/sdk";

@Injectable()
export class EventService implements IEventService {
    constructor(private readonly management: EventManagementService) {}

    async create(requestor: UserModel, input: CreateEventInput): Promise<void> {
        const {
            name,
            description,
            startedAt,
            endedAt,
            condition,
            rewardDistributionType,
        } = input;

        throw new Error("Method not implemented.");
    }

    update(
        requestor: UserModel,
        id: string,
        input: UpdateEventInput
    ): Promise<void> {
        throw new Error("Method not implemented.");
    }
    findOne(requestor: UserModel, id: string): Promise<EventModel> {
        throw new Error("Method not implemented.");
    }
    findAll(
        requestor: UserModel,
        query: FindAllEventsQuery
    ): Promise<EventModel[]> {
        throw new Error("Method not implemented.");
    }
    createEventCondition(
        requestor: UserModel,
        input: CreateEventConditionInput
    ): Promise<void> {
        throw new Error("Method not implemented.");
    }
    findAllEventConditions(
        requestor: UserModel,
        query: FindAllEventConditionsQuery
    ): Promise<EventConditionModel[]> {
        throw new Error("Method not implemented.");
    }
    settingRewards(
        requestor: UserModel,
        eventId: string,
        input: SettingRewardsInput
    ): Promise<void> {
        throw new Error("Method not implemented.");
    }
    requestReward(requestor: UserModel, eventId: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    approveRewardRequest(
        requestor: UserModel,
        rewardRequestId: string
    ): Promise<void> {
        throw new Error("Method not implemented.");
    }
    rejectRewardRequest(
        requestor: UserModel,
        rewardRequestId: string,
        input: RejectRewardRequestInput
    ): Promise<void> {
        throw new Error("Method not implemented.");
    }
    findOneRewardRequest(
        requestor: UserModel,
        rewardRequestId: string
    ): Promise<EventRewardRequestModel> {
        throw new Error("Method not implemented.");
    }
    findAllRewardRequests(
        requestor: UserModel,
        query: FindAllRewardRequestsQuery
    ): Promise<EventRewardRequestModel[]> {
        throw new Error("Method not implemented.");
    }
    createEventUserLogging(input: CreateEventUserLoggingInput): Promise<void> {
        throw new Error("Method not implemented.");
    }
    findAllEventUserLoggings(
        requestor: UserModel,
        query: FindAllEventUserLoggingsQuery
    ): Promise<EventUserLoggingModel[]> {
        throw new Error("Method not implemented.");
    }
}
