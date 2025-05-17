import { Body, Controller, Get } from "@nestjs/common";
import { EventService } from "./event.service";
import {
    CommonResponse,
    CreateEventConditionInput,
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
    IEventController,
    RejectRewardRequestInput,
    SettingRewardsInput,
    UpdateEventInput,
    UserModel,
} from "@app/sdk";
import { ApiTags } from "@nestjs/swagger";
import {
    asSuccessResponse,
    CommonResponseDto,
    Requestor,
    Route,
} from "@app/common";
import { CreateEventInputDto } from "./dto/body/create-event-input.dto";

@ApiTags(EventRoute.apiTags)
@Controller()
export class EventController implements IEventController {
    constructor(private readonly eventService: EventService) {}

    @Route.Post(EventRoute.create, {
        summary: "이벤트 생성",
        passThrough: true,
    })
    async create(
        @Requestor() requestor: UserModel,
        @Body() input: CreateEventInputDto
    ): Promise<CommonResponseDto<void>> {
        const result = await this.eventService.create(requestor, input);
        return asSuccessResponse("이벤트 생성 성공", result);
    }

    update(
        requestor: UserModel,
        id: string,
        input: UpdateEventInput
    ): Promise<CommonResponse<void>> {
        throw new Error("Method not implemented.");
    }

    findOne(
        requestor: UserModel,
        id: string
    ): Promise<CommonResponse<EventModel>> {
        throw new Error("Method not implemented.");
    }

    findAll(
        requestor: UserModel,
        query: FindAllEventsQuery
    ): Promise<CommonResponse<EventModel[]>> {
        throw new Error("Method not implemented.");
    }

    createEventCondition(
        requestor: UserModel,
        input: CreateEventConditionInput
    ): Promise<CommonResponse<void>> {
        throw new Error("Method not implemented.");
    }

    findAllEventConditions(
        requestor: UserModel,
        query: FindAllEventConditionsQuery
    ): Promise<CommonResponse<EventConditionModel[]>> {
        throw new Error("Method not implemented.");
    }

    settingRewards(
        requestor: UserModel,
        eventId: string,
        input: SettingRewardsInput
    ): Promise<CommonResponse<void>> {
        throw new Error("Method not implemented.");
    }

    requestReward(
        requestor: UserModel,
        eventId: string
    ): Promise<CommonResponse<void>> {
        throw new Error("Method not implemented.");
    }

    approveRewardRequest(
        requestor: UserModel,
        rewardRequestId: string
    ): Promise<CommonResponse<void>> {
        throw new Error("Method not implemented.");
    }
    rejectRewardRequest(
        requestor: UserModel,
        rewardRequestId: string,
        input: RejectRewardRequestInput
    ): Promise<CommonResponse<void>> {
        throw new Error("Method not implemented.");
    }

    findOneRewardRequest(
        requestor: UserModel,
        rewardRequestId: string
    ): Promise<CommonResponse<EventRewardRequestModel>> {
        throw new Error("Method not implemented.");
    }
    findAllRewardRequests(
        requestor: UserModel,
        query: FindAllRewardRequestsQuery
    ): Promise<CommonResponse<EventRewardRequestModel[]>> {
        throw new Error("Method not implemented.");
    }

    createEventUserLogging(
        input: CreateEventUserLoggingInput
    ): Promise<CommonResponse<void>> {
        throw new Error("Method not implemented.");
    }

    findAllEventUserLoggings(
        requestor: UserModel,
        query: FindAllEventUserLoggingsQuery
    ): Promise<CommonResponse<EventUserLoggingModel[]>> {
        throw new Error("Method not implemented.");
    }
}
