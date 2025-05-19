import { HttpStatus, Injectable } from "@nestjs/common";
import { EventConditionRepository } from "../repositories/event-condition.repository";
import {
    CreateEventConditionInput,
    EventConditionGroup,
    EventConditionModel,
    FindAllEventConditionsQuery,
    Paginated,
    UserModel,
} from "@app/sdk";
import { EventConditionMapper } from "../mapper";
import { RpcException } from "@nestjs/microservices";
import { EventConditionValidator } from "../domain/event-condition-validator";
import { extractLeftOperandIds } from "../domain/extract-left-operand-ids";
import { FilterQuery } from "mongoose";
import { EventCondition } from "../schemas";

@Injectable()
export class EventConditionService {
    constructor(
        private readonly eventConditionRepo: EventConditionRepository
    ) {}

    // 이벤트 조건 생성
    async create(
        creator: UserModel,
        input: CreateEventConditionInput
    ): Promise<EventConditionModel> {
        const { fieldName, displayName, type } = input;
        await this.assertDuplicateFieldName(fieldName);
        const eventCondition = await this.eventConditionRepo.create({
            fieldName,
            displayName,
            type,
            createdBy: creator.id,
        });
        return EventConditionMapper.toModel(eventCondition);
    }

    async findOneOrThrowById(id: string): Promise<EventConditionModel> {
        const eventCondition = await this.eventConditionRepo.findOne({
            _id: id,
        });
        if (!eventCondition) {
            throw new RpcException({
                statusCode: HttpStatus.NOT_FOUND,
                message: "이벤트 조건을 찾을 수 없습니다.",
            });
        }
        return EventConditionMapper.toModel(eventCondition);
    }

    // 이벤트 조건 필드명 중복 검증
    async assertDuplicateFieldName(fieldName: string): Promise<void> {
        const eventCondition = await this.eventConditionRepo.findOne({
            fieldName,
        });
        if (eventCondition) {
            throw new RpcException({
                statusCode: HttpStatus.BAD_REQUEST,
                message: "이미 존재하는 필드명입니다.",
            });
        }
    }

    // 이벤트 조건 전체 조회
    async findAll(
        query?: FindAllEventConditionsQuery
    ): Promise<Paginated<EventConditionModel>> {
        const { skip, take, displayName } = query;

        // Query
        const filter: FilterQuery<EventCondition> = {};
        if (displayName) {
            filter.displayName = { $regex: displayName, $options: "i" };
        }

        // Find
        const total = await this.eventConditionRepo.count(filter);
        const list = await this.eventConditionRepo.findAllPaginated(filter, {
            skip,
            take,
        });
        return {
            total,
            size: list.length,
            list: list.map(EventConditionMapper.toModel),
        };
    }

    // IDs 기반 조회
    async findAllByIds(ids: string[]): Promise<EventConditionModel[]> {
        const eventConditions = await this.eventConditionRepo.findAll({
            _id: { $in: ids },
        });
        return eventConditions.map(EventConditionMapper.toModel);
    }

    // 이벤트 조건 그룹 검증
    async assertInvalidConditionGroup(
        condition: EventConditionGroup
    ): Promise<void> {
        const eventConditionIds = extractLeftOperandIds(condition);
        const availableConditions = await this.findAllByIds(eventConditionIds);
        const isValid = EventConditionValidator.validate(
            condition,
            availableConditions
        );
        if (!isValid) {
            throw new RpcException({
                statusCode: HttpStatus.BAD_REQUEST,
                message: "이벤트 조건이 올바르지 않습니다.",
            });
        }
    }
}
