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
    Paginated,
    RejectRewardRequestInput,
    UpdateEventInput,
    UserModel,
} from "@app/sdk";
import {
    EventService,
    EventConditionService,
    EventRewardRequestService,
    EventUserLoggingService,
} from "./providers";

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
        await this.eventService.create(user, body);
    }

    @MessagePattern(EventRoute.update.cmd)
    async update(
        @Payload()
        payload: [user: UserModel, id: string, input: UpdateEventInput]
    ): Promise<void> {
        const [user, id, input] = payload;
        await this.eventService.update(user, id, input);
    }

    @MessagePattern(EventRoute.findOne.cmd)
    async findOne(@Payload() payload: [id: string]): Promise<EventModel> {
        const [id] = payload;
        return await this.eventService.findOneOrThrowById(id);
    }

    @MessagePattern(EventRoute.findAll.cmd)
    async findAll(
        @Payload() payload: [query: FindAllEventsQuery]
    ): Promise<Paginated<EventModel>> {
        const [query] = payload;
        return await this.eventService.findAll(query);
    }

    @MessagePattern(EventRoute.createEventCondition.cmd)
    async createEventCondition(
        @Payload() payload: [user: UserModel, body: CreateEventConditionInput]
    ): Promise<void> {
        const [user, body] = payload;
        await this.eventConditionService.create(user, body);
    }

    @MessagePattern(EventRoute.findAllEventConditions.cmd)
    async findAllEventConditions(
        @Payload()
        payload: [user: UserModel, query: FindAllEventConditionsQuery]
    ): Promise<Paginated<EventConditionModel>> {
        return await this.eventConditionService.findAll(payload[1]);
    }

    @MessagePattern(EventRoute.requestReward.cmd)
    async requestReward(
        @Payload() payload: [user: UserModel, eventId: string]
    ): Promise<void> {
        const [user, eventId] = payload;
        console.log("user", user);
        await this.eventRewardRequestService.requestReward(user, eventId);
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
        const [user, rewardRequestId] = payload;
        return await this.eventRewardRequestService.findOneOrThrowById(
            user,
            rewardRequestId
        );
    }

    @MessagePattern(EventRoute.findAllRewardRequests.cmd)
    async findAllRewardRequests(
        @Payload() payload: [user: UserModel, query: FindAllRewardRequestsQuery]
    ): Promise<Paginated<EventRewardRequestModel>> {
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
    ): Promise<Paginated<EventUserLoggingModel>> {
        return await this.eventUserLoggingService.findAll(payload[1]);
    }
}
