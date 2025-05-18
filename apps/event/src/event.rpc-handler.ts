import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import {
    CreateEventConditionInput,
    CreateEventInput,
    CreateEventUserLoggingInput,
    EventConditionModel,
    EventModel,
    EventRewardRequestModel,
    EventRoute,
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
import {
    EventService,
    EventConditionService,
    EventRewardRequestService,
    EventUserLoggingService,
} from "./providers";
import { PaginatedDto } from "@app/common";

@Controller()
export class EventRpcHandler implements IEventService {
    constructor(
        private readonly eventService: EventService,
        private readonly eventConditionService: EventConditionService,
        private readonly eventRewardRequestService: EventRewardRequestService,
        private readonly eventUserLoggingService: EventUserLoggingService
    ) {}

    @MessagePattern(EventRoute.create.cmd)
    async create(
        @Payload() payload: [user: UserModel, body: CreateEventInput]
    ): Promise<void> {
        const [user, body] = payload;
        await this.eventService.createEvent(user, body);
    }

    @MessagePattern(EventRoute.update.cmd)
    async update(
        @Payload()
        payload: [user: UserModel, id: string, input: UpdateEventInput]
    ): Promise<void> {
        const [user, id, input] = payload;
        const event = await this.eventService.findOneOrThrowById(id);
        await this.eventService.updateEvent({
            event,
            input,
            updatedBy: user.id,
        });
    }

    @MessagePattern(EventRoute.findOne.cmd)
    async findOne(
        @Payload() payload: [user: UserModel, id: string]
    ): Promise<EventModel> {
        return await this.eventService.findOneOrThrowById(payload[1]);
    }

    @MessagePattern(EventRoute.findAll.cmd)
    async findAll(
        @Payload() payload: [user: UserModel, query: FindAllEventsQuery]
    ): Promise<EventModel[]> {
        return await this.eventService.findAll(payload[1]);
    }

    @MessagePattern(EventRoute.createEventCondition.cmd)
    async createEventCondition(
        @Payload() payload: [user: UserModel, body: CreateEventConditionInput]
    ): Promise<void> {
        const [user, body] = payload;
        await this.eventConditionService.create({
            fieldName: body.fieldName,
            displayName: body.displayName,
            type: body.type,
            createdBy: user.id,
        });
    }

    @MessagePattern(EventRoute.findAllEventConditions.cmd)
    async findAllEventConditions(
        @Payload()
        payload: [user: UserModel, query: FindAllEventConditionsQuery]
    ): Promise<EventConditionModel[]> {
        return await this.eventConditionService.findAll(payload[1]);
    }

    @MessagePattern(EventRoute.settingRewards.cmd)
    async settingRewards(
        @Payload()
        payload: [user: UserModel, eventId: string, input: SettingRewardsInput]
    ): Promise<void> {
        const [user, eventId, input] = payload;
        const event = await this.eventService.findOneOrThrowById(eventId);
        await this.eventService.settingRewards({
            event,
            input,
            updatedBy: user.id,
        });
    }

    @MessagePattern(EventRoute.requestReward.cmd)
    async requestReward(
        @Payload() payload: [user: UserModel, eventId: string]
    ): Promise<void> {
        const [user, eventId] = payload;
        const event = await this.eventService.findOneOrThrowById(eventId);
        await this.eventRewardRequestService.requestReward(user, event);
    }

    @MessagePattern(EventRoute.approveRewardRequest.cmd)
    async approveRewardRequest(
        @Payload() payload: [user: UserModel, rewardRequestId: string]
    ): Promise<void> {
        const [user, rewardRequestId] = payload;
        await this.eventRewardRequestService.approveRewardRequest(
            user,
            rewardRequestId
        );
    }

    @MessagePattern(EventRoute.rejectRewardRequest.cmd)
    async rejectRewardRequest(
        @Payload()
        payload: [
            user: UserModel,
            rewardRequestId: string,
            input: RejectRewardRequestInput
        ]
    ): Promise<void> {
        const [user, rewardRequestId, input] = payload;
        await this.eventRewardRequestService.rejectRewardRequest(
            user,
            rewardRequestId,
            input
        );
    }

    @MessagePattern(EventRoute.findOneRewardRequest.cmd)
    async findOneRewardRequest(
        @Payload() payload: [user: UserModel, rewardRequestId: string]
    ): Promise<EventRewardRequestModel> {
        return await this.eventRewardRequestService.findOneOrThrowById(
            payload[1]
        );
    }

    @MessagePattern(EventRoute.findAllRewardRequests.cmd)
    async findAllRewardRequests(
        @Payload() payload: [user: UserModel, query: FindAllRewardRequestsQuery]
    ): Promise<PaginatedDto<EventRewardRequestModel>> {
        const [user, query] = payload;
        return await this.eventRewardRequestService.findAllRewardRequests(
            user,
            query
        );
    }

    @MessagePattern(EventRoute.createEventUserLogging.cmd)
    async createEventUserLogging(
        @Payload() payload: [input: CreateEventUserLoggingInput]
    ): Promise<void> {
        const [input] = payload;
        await this.eventUserLoggingService.create(input);
    }

    @MessagePattern(EventRoute.findAllEventUserLoggings.cmd)
    async findAllEventUserLoggings(
        @Payload()
        payload: [user: UserModel, query: FindAllEventUserLoggingsQuery]
    ): Promise<EventUserLoggingModel[]> {
        return await this.eventUserLoggingService.findAll(payload[1]);
    }
}
