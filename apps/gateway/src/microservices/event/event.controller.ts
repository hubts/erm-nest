import {
    Body,
    Controller,
    Inject,
    Param,
    ParseUUIDPipe,
    Query,
} from "@nestjs/common";
import {
    EventRoute,
    EventConditionModel,
    EventModel,
    EventRewardRequestModel,
    EventUserLoggingModel,
    UserModel,
    IEventController,
} from "@app/sdk";
import { ApiTags } from "@nestjs/swagger";
import {
    asSuccessResponse,
    CommonResponseDto,
    PaginatedDto,
    Requestor,
    Route,
} from "@app/common";
import { ClientProxy } from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";
import { EVENT_SERVICE } from "../../gateway.constants";
import {
    CreateEventConditionInputDto,
    CreateEventInputDto,
    CreateEventUserLoggingInputDto,
    RejectRewardRequestInputDto,
    SettingRewardsInputDto,
    UpdateEventInputDto,
} from "./dto/body";
import {
    FindAllEventConditionsQueryDto,
    FindAllEventsQueryDto,
    FindAllEventUserLoggingsQueryDto,
    FindAllRewardRequestsQueryDto,
} from "./dto/query";

@ApiTags(EventRoute.apiTags)
@Controller(EventRoute.pathPrefix)
export class EventController implements IEventController {
    constructor(
        @Inject(EVENT_SERVICE)
        private readonly eventClient: ClientProxy
    ) {}

    @Route.Post(EventRoute.create, {
        summary: "이벤트 생성",
    })
    async create(
        @Requestor() requestor: UserModel,
        @Body() input: CreateEventInputDto
    ): Promise<CommonResponseDto> {
        await firstValueFrom(
            this.eventClient.send(EventRoute.create.cmd, [requestor, input])
        );
        return asSuccessResponse("이벤트 생성 성공");
    }

    @Route.Put(EventRoute.update, {
        summary: "이벤트 수정",
    })
    async update(
        @Requestor() requestor: UserModel,
        @Param("id", ParseUUIDPipe) id: string,
        @Body() input: UpdateEventInputDto
    ): Promise<CommonResponseDto> {
        await firstValueFrom(
            this.eventClient.send(EventRoute.update.cmd, [requestor, id, input])
        );
        return asSuccessResponse("이벤트 수정 성공");
    }

    @Route.Get(EventRoute.findOne, {
        summary: "이벤트 상세 조회",
    })
    async findOne(
        @Requestor() requestor: UserModel,
        @Param("id", ParseUUIDPipe) id: string
    ): Promise<CommonResponseDto<EventModel>> {
        const result = await firstValueFrom(
            this.eventClient.send(EventRoute.findOne.cmd, [requestor, id])
        );
        return asSuccessResponse("이벤트 상세 조회 성공", result);
    }

    @Route.Get(EventRoute.findAll, {
        summary: "이벤트 목록 조회",
    })
    async findAll(
        @Requestor() requestor: UserModel,
        @Query() query: FindAllEventsQueryDto
    ): Promise<CommonResponseDto<EventModel[]>> {
        const result = await firstValueFrom(
            this.eventClient.send(EventRoute.findAll.cmd, [requestor, query])
        );
        return asSuccessResponse("이벤트 목록 조회 성공", result);
    }

    @Route.Post(EventRoute.createEventCondition, {
        summary: "이벤트 조건 생성",
    })
    async createEventCondition(
        @Requestor() requestor: UserModel,
        @Body() input: CreateEventConditionInputDto
    ): Promise<CommonResponseDto> {
        await firstValueFrom(
            this.eventClient.send(EventRoute.createEventCondition.cmd, [
                requestor,
                input,
            ])
        );
        return asSuccessResponse("이벤트 조건 생성 성공");
    }

    @Route.Get(EventRoute.findAllEventConditions, {
        summary: "이벤트 조건 목록 조회",
    })
    async findAllEventConditions(
        @Requestor() requestor: UserModel,
        @Query() query: FindAllEventConditionsQueryDto
    ): Promise<CommonResponseDto<EventConditionModel[]>> {
        const result = await firstValueFrom(
            this.eventClient.send(EventRoute.findAllEventConditions.cmd, [
                requestor,
                query,
            ])
        );
        return asSuccessResponse("이벤트 조건 목록 조회 성공", result);
    }

    @Route.Post(EventRoute.settingRewards, {
        summary: "이벤트 보상 설정",
    })
    async settingRewards(
        @Requestor() requestor: UserModel,
        @Param("id", ParseUUIDPipe) eventId: string,
        @Body() input: SettingRewardsInputDto
    ): Promise<CommonResponseDto> {
        await firstValueFrom(
            this.eventClient.send(EventRoute.settingRewards.cmd, [
                requestor,
                eventId,
                input,
            ])
        );
        return asSuccessResponse("이벤트 보상 설정 성공");
    }

    @Route.Post(EventRoute.requestReward, {
        summary: "이벤트 보상 요청",
    })
    async requestReward(
        @Requestor() requestor: UserModel,
        @Param("id", ParseUUIDPipe) eventId: string
    ): Promise<CommonResponseDto> {
        await firstValueFrom(
            this.eventClient.send(EventRoute.requestReward.cmd, [
                requestor,
                eventId,
            ])
        );
        return asSuccessResponse("이벤트 보상 요청 성공");
    }

    @Route.Post(EventRoute.approveRewardRequest, {
        summary: "이벤트 보상 요청 승인",
    })
    async approveRewardRequest(
        @Requestor() requestor: UserModel,
        @Param("id", ParseUUIDPipe) rewardRequestId: string
    ): Promise<CommonResponseDto> {
        await firstValueFrom(
            this.eventClient.send(EventRoute.approveRewardRequest.cmd, [
                requestor,
                rewardRequestId,
            ])
        );
        return asSuccessResponse("이벤트 보상 요청 승인완료");
    }

    @Route.Post(EventRoute.rejectRewardRequest, {
        summary: "이벤트 보상 요청 거절",
    })
    async rejectRewardRequest(
        @Requestor() requestor: UserModel,
        @Param("id", ParseUUIDPipe) rewardRequestId: string,
        @Body() input: RejectRewardRequestInputDto
    ): Promise<CommonResponseDto> {
        await firstValueFrom(
            this.eventClient.send(EventRoute.rejectRewardRequest.cmd, [
                requestor,
                rewardRequestId,
                input,
            ])
        );
        return asSuccessResponse("이벤트 보상 요청 거절완료");
    }

    @Route.Get(EventRoute.findOneRewardRequest, {
        summary: "이벤트 보상 요청 상세 조회",
    })
    async findOneRewardRequest(
        @Requestor() requestor: UserModel,
        @Param("id", ParseUUIDPipe) rewardRequestId: string
    ): Promise<CommonResponseDto<EventRewardRequestModel>> {
        const result = await firstValueFrom(
            this.eventClient.send(EventRoute.findOneRewardRequest.cmd, [
                requestor,
                rewardRequestId,
            ])
        );
        return asSuccessResponse("이벤트 보상 요청 상세 조회 성공", result);
    }

    @Route.Get(EventRoute.findAllRewardRequests, {
        summary: "이벤트 보상 요청 목록 조회",
    })
    async findAllRewardRequests(
        @Requestor() requestor: UserModel,
        @Query() query: FindAllRewardRequestsQueryDto
    ): Promise<CommonResponseDto<PaginatedDto<EventRewardRequestModel>>> {
        const result = await firstValueFrom(
            this.eventClient.send(EventRoute.findAllRewardRequests.cmd, [
                requestor,
                query,
            ])
        );
        return asSuccessResponse("이벤트 보상 요청 목록 조회 성공", result);
    }

    @Route.Post(EventRoute.createEventUserLogging, {
        summary: "[테스트용] 이벤트 사용자 로깅 생성",
    })
    async createEventUserLogging(
        @Body() input: CreateEventUserLoggingInputDto
    ): Promise<CommonResponseDto> {
        await firstValueFrom(
            this.eventClient.send(EventRoute.createEventUserLogging.cmd, [
                input,
            ])
        );
        return asSuccessResponse("이벤트 사용자 로깅 생성 성공");
    }

    @Route.Get(EventRoute.findAllEventUserLoggings, {
        summary: "[테스트용] 이벤트 사용자 로깅 목록 조회",
    })
    async findAllEventUserLoggings(
        @Requestor() requestor: UserModel,
        @Query() query: FindAllEventUserLoggingsQueryDto
    ): Promise<CommonResponseDto<EventUserLoggingModel[]>> {
        const result = await firstValueFrom(
            this.eventClient.send(EventRoute.findAllEventUserLoggings.cmd, [
                requestor,
                query,
            ])
        );
        return asSuccessResponse("이벤트 사용자 로깅 목록 조회 성공", result);
    }
}
