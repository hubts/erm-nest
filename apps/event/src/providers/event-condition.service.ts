import { HttpStatus, Injectable } from "@nestjs/common";
import { EventConditionRepository } from "../repositories/event-condition.repository";
import {
    EventConditionGroup,
    EventConditionModel,
    FindAllEventConditionsQuery,
} from "@app/sdk";
import { EventConditionMapper } from "../mapper";
import { RpcException } from "@nestjs/microservices";
import { EventConditionValidator } from "../domain/event-condition-validator";
import { extractLeftOperandIds } from "../domain/extract-left-operand-ids";

@Injectable()
export class EventConditionService {
    constructor(
        private readonly eventConditionRepo: EventConditionRepository
    ) {}

    async create(
        input: Pick<
            EventConditionModel,
            "fieldName" | "displayName" | "type" | "createdBy"
        >
    ): Promise<EventConditionModel> {
        const { fieldName, displayName, type, createdBy } = input;
        await this.assertDuplicateFieldName(fieldName);
        const eventCondition = await this.eventConditionRepo.create({
            fieldName,
            displayName,
            type,
            createdBy,
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

    async findAll(
        query?: FindAllEventConditionsQuery
    ): Promise<EventConditionModel[]> {
        const { skip, take, displayName } = query;
        const eventConditions = await this.eventConditionRepo.findPaginated(
            {
                ...(displayName ? { displayName } : {}),
            },
            { skip, take }
        );
        return eventConditions.map(EventConditionMapper.toModel);
    }

    async findAllByIds(ids: string[]): Promise<EventConditionModel[]> {
        const eventConditions = await this.eventConditionRepo.findAll({
            _id: { $in: ids },
        });
        return eventConditions.map(EventConditionMapper.toModel);
    }

    async assertInvalidConditionGroup(condition: EventConditionGroup) {
        const eventConditionIds = extractLeftOperandIds(condition);
        const eventConditions = await this.eventConditionRepo.findAll({
            _id: { $in: eventConditionIds },
        });
        const availableConditions = eventConditions.map(
            EventConditionMapper.toModel
        );
        if (!EventConditionValidator.validate(condition, availableConditions)) {
            throw new RpcException({
                statusCode: HttpStatus.BAD_REQUEST,
                message: "이벤트 조건이 올바르지 않습니다.",
            });
        }
    }
}
