import { HttpStatus, Injectable } from "@nestjs/common";
import { EventRewardRequestRepository } from "../repositories";
import {
    EventRewardRequestModel,
    FindAllRewardRequestsQuery,
    Paginated,
    RejectRewardRequestInput,
    UserModel,
} from "@app/sdk";
import { extractLeftOperandIds } from "../domain/extract-left-operand-ids";
import { EventConditionService } from "./event-condition.service";
import { EventUserLoggingService } from "./event-user-logging.service";
import { checkEventRewardRequest } from "../domain/event-reward-request-checker";
import { RpcException } from "@nestjs/microservices";
import { FilterQuery, Types } from "mongoose";
import { EventRewardRequest } from "../schemas";
import { EventRewardRequestMapper } from "../mapper";
import { EventService } from "./event.service";

@Injectable()
export class EventRewardRequestService {
    constructor(
        private readonly eventRewardRequestRepo: EventRewardRequestRepository,
        private readonly eventConditionService: EventConditionService,
        private readonly eventUserLoggingService: EventUserLoggingService,
        private readonly eventService: EventService
    ) {}

    /**
     * 이벤트 보상 요청
     * 이벤트 보상 요청은 언제든지 수행할 수 있다.
     * 단, 이벤트가 비활성화된 상태이면 요청할 수 없다.
     */
    async requestReward(user: UserModel, eventId: string): Promise<void> {
        console.log("userId", user.id);
        // 이벤트 조회
        const event = await this.eventService.findOneOrThrowById(eventId);
        this.eventService.assertEventIs(event, "inactive");

        // 최신 중복 보상 요청 확인
        const existingRewardRequest = await this.eventRewardRequestRepo.findOne(
            {
                event: new Types.ObjectId(eventId),
                user: new Types.ObjectId(user.id),
                status: { $ne: "insufficient" },
            }
        );
        if (existingRewardRequest) {
            throw new RpcException({
                statusCode: HttpStatus.BAD_REQUEST,
                message: "이미 보상 요청을 한 이벤트입니다.",
            });
        }
        // 조건불충분이었던 경우, 재신청 가능

        // 조건 검사 자동 시스템
        const eventConditionIds = extractLeftOperandIds(event.condition);
        const eventConditions = await this.eventConditionService.findAllByIds(
            eventConditionIds
        );
        const eventConditionFieldNames = eventConditions.map(
            condition => condition.fieldName
        );
        const eventUserLoggings = await this.eventUserLoggingService.findAll({
            skip: -1,
            take: -1,
            userId: user.id,
            fieldNames: eventConditionFieldNames,
            // startedAt: event.startedAt,
            // endedAt: event.endedAt,
        });
        console.log(eventUserLoggings);
        const isSatisfied = checkEventRewardRequest(
            event.condition,
            eventConditions,
            eventUserLoggings.list
        );

        // 저장
        const status = !isSatisfied
            ? "insufficient"
            : event.rewardDistributionType === "manual"
            ? "pending"
            : "approved";
        const created = await this.eventRewardRequestRepo.create({
            event: new Types.ObjectId(event.id),
            user: new Types.ObjectId(user.id),
            status,
            determinedAt: status === "approved" ? new Date() : undefined,
            receivedRewards: status === "approved" ? event.rewards : [],
            eventUserLoggings: eventUserLoggings.list,
        });
        console.log("created", created);
    }

    // Approve reward request
    async approveRewardRequest(
        user: UserModel,
        rewardRequestId: string
    ): Promise<void> {
        const rewardRequest = await this.findOneOrThrowById(
            user,
            rewardRequestId
        );
        if (rewardRequest.status !== "pending") {
            throw new RpcException({
                statusCode: HttpStatus.BAD_REQUEST,
                message: "이미 승인되거나 거절된 이벤트 보상 요청입니다.",
            });
        }
        const event = await this.eventService.findOneOrThrowById(
            rewardRequest.eventId
        );
        await this.eventRewardRequestRepo.updateOne(
            {
                _id: rewardRequest.id,
            },
            {
                status: "approved",
                determinedAt: new Date(),
                determinedBy: user.id,
                receivedRewards: event.rewards,
            }
        );
    }

    // Reject reward request
    async rejectRewardRequest(
        user: UserModel,
        rewardRequestId: string,
        input: RejectRewardRequestInput
    ): Promise<void> {
        const { reason } = input;
        console.log(rewardRequestId);
        const rewardRequest = await this.findOneOrThrowById(
            user,
            rewardRequestId
        );
        if (rewardRequest.status !== "pending") {
            throw new RpcException({
                statusCode: HttpStatus.BAD_REQUEST,
                message: "이미 승인되거나 거절된 이벤트 보상 요청입니다.",
            });
        }
        await this.eventRewardRequestRepo.updateOne(
            {
                _id: rewardRequest.id,
            },
            {
                status: "rejected",
                determinedAt: new Date(),
                determinedBy: user.id,
                reason,
            }
        );
    }

    // Find one reward request
    async findOneOrThrowById(user: UserModel, id: string) {
        const eventRewardRequest = await this.eventRewardRequestRepo.findOne({
            _id: id,
        });
        if (!eventRewardRequest) {
            throw new RpcException({
                statusCode: HttpStatus.NOT_FOUND,
                message: "해당 이벤트 보상 요청을 찾을 수 없습니다.",
            });
        } else if (
            user.role === "USER" &&
            eventRewardRequest.user._id.toString() !== user.id
        ) {
            throw new RpcException({
                statusCode: HttpStatus.NOT_FOUND,
                message: "해당 이벤트 보상 요청에 접근할 수 없습니다.",
            });
        }
        return EventRewardRequestMapper.toModel(eventRewardRequest);
    }

    // Find reward requests
    async findAllRewardRequests(
        user: UserModel,
        query: FindAllRewardRequestsQuery
    ): Promise<Paginated<EventRewardRequestModel>> {
        // Role-base Query
        if (user.role === "USER") {
            query.userId = user.id;
        }

        // Query
        const { skip, take, eventId, userId, status } = query;
        const filter: FilterQuery<EventRewardRequest> = {};
        if (eventId) {
            filter.event = new Types.ObjectId(eventId);
        }
        if (userId) {
            filter.user = new Types.ObjectId(userId);
        }
        if (status) {
            filter.status = status;
        }

        const total = await this.eventRewardRequestRepo.count(filter);
        const list = await this.eventRewardRequestRepo.findAllPaginated(
            filter,
            {
                skip,
                take,
            }
        );
        return {
            total,
            size: list.length,
            list: list.map(EventRewardRequestMapper.toModel),
        };
    }
}
