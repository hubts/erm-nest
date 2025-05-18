import { HttpStatus, Injectable } from "@nestjs/common";
import { EventRewardRequestRepository } from "../repositories";
import {
    EventModel,
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
import { FilterQuery } from "mongoose";
import { EventRewardRequest } from "../schemas";
import { EventRewardRequestMapper } from "../mapper";

@Injectable()
export class EventRewardRequestService {
    constructor(
        private readonly eventRewardRequestRepo: EventRewardRequestRepository,
        private readonly eventConditionService: EventConditionService,
        private readonly eventUserLoggingService: EventUserLoggingService
    ) {}

    async requestReward(user: UserModel, event: EventModel) {
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
        });
        const isSatisfied = checkEventRewardRequest(
            event.condition,
            eventConditions,
            eventUserLoggings
        );

        // 저장
        const status = !isSatisfied
            ? "insufficient"
            : event.rewardDistributionType === "manual"
            ? "pending"
            : "approved";
        await this.eventRewardRequestRepo.create({
            event,
            user,
            status,
            determinedAt: status === "approved" ? new Date() : undefined,
            receivedRewards: status === "approved" ? event.rewards : [],
        });
    }

    async approveRewardRequest(
        user: UserModel,
        rewardRequestId: string
    ): Promise<void> {
        const rewardRequest = await this.findOneOrThrowById(rewardRequestId);
        await this.eventRewardRequestRepo.updateOne(
            {
                _id: rewardRequest.id,
            },
            {
                status: "approved",
                determinedAt: new Date(),
                determinedBy: user.id,
            }
        );
    }

    async rejectRewardRequest(
        user: UserModel,
        rewardRequestId: string,
        input: RejectRewardRequestInput
    ): Promise<void> {
        const { reason } = input;
        const rewardRequest = await this.findOneOrThrowById(rewardRequestId);
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

    async findOneOrThrowById(id: string) {
        const eventRewardRequest = await this.eventRewardRequestRepo.findOne({
            id,
        });
        if (!eventRewardRequest) {
            throw new RpcException({
                statusCode: HttpStatus.NOT_FOUND,
                message: "해당 이벤트 보상 요청을 찾을 수 없습니다.",
            });
        }
        return EventRewardRequestMapper.toModel(eventRewardRequest);
    }

    async findAllRewardRequests(
        user: UserModel,
        query: FindAllRewardRequestsQuery
    ): Promise<Paginated<EventRewardRequestModel>> {
        // Role-base Query
        if (user.role === "USER") {
            query.userId = user.id;
        }

        const { skip, take, eventId, userId, status } = query;
        const filter: FilterQuery<EventRewardRequest> = {};
        if (eventId) {
            filter.eventId = eventId;
        }
        if (userId) {
            filter.userId = userId;
        }
        if (status) {
            filter.status = status;
        }

        const total = await this.eventRewardRequestRepo.count(filter);

        const list = await this.eventRewardRequestRepo.findPaginated(filter, {
            skip,
            take,
        });

        return {
            total,
            size: list.length,
            list: list.map(EventRewardRequestMapper.toModel),
        };
    }
}
