import { HttpStatus, Injectable } from "@nestjs/common";
import { EventRepository } from "../repositories/event.repository";
import {
    CreateEventInput,
    EventModel,
    FindAllEventsQuery,
    UpdateEventInput,
    UserModel,
} from "@app/sdk";
import { EventConditionService } from "./event-condition.service";
import { RpcException } from "@nestjs/microservices";
import { EventMapper } from "../mapper";
import { generateId } from "@app/common";

@Injectable()
export class EventService {
    constructor(
        private readonly eventRepo: EventRepository,
        private readonly eventConditionService: EventConditionService
    ) {}

    // 이벤트 생성
    async createEvent(creator: UserModel, input: CreateEventInput) {
        const {
            name,
            description,
            startedAt,
            endedAt,
            condition,
            rewardDistributionType,
            rewards,
        } = input;

        // Check date between
        if (new Date(startedAt).getTime() >= new Date(endedAt).getTime()) {
            throw new RpcException({
                statusCode: HttpStatus.BAD_REQUEST,
                message: "이벤트 시작 시간은 종료 시간보다 이전이어야 합니다.",
            });
        }

        // Check condition
        await this.eventConditionService.assertInvalidConditionGroup(condition);

        // Save
        const event = await this.eventRepo.create({
            name,
            description,
            startedAt,
            endedAt,
            condition,
            rewardDistributionType,
            createdBy: creator.id,
            rewards: rewards.map(reward => {
                return {
                    id: generateId(),
                    name: reward.name,
                    type: reward.type,
                    amount: reward.amount,
                };
            }),
        });
        return EventMapper.toModel(event);
    }

    // Update the event
    async updateEvent(data: {
        event: EventModel;
        input: UpdateEventInput;
        updatedBy: string;
    }) {
        const { event, input, updatedBy } = data;
        const {
            name,
            description,
            startedAt,
            endedAt,
            condition,
            rewardDistributionType,
            rewards,
        } = input;

        // Check the existing event is ongoing
        if (event.startedAt < new Date() && event.endedAt > new Date()) {
            throw new RpcException({
                statusCode: HttpStatus.BAD_REQUEST,
                message: "이벤트가 진행 중입니다.",
            });
        }

        // Check new date is in-between
        if (new Date(startedAt).getTime() >= new Date(endedAt).getTime()) {
            throw new RpcException({
                statusCode: HttpStatus.BAD_REQUEST,
                message: "이벤트 시작 시간은 종료 시간보다 이전이어야 합니다.",
            });
        }

        // Check condition
        if (condition && event.condition !== condition) {
            await this.eventConditionService.assertInvalidConditionGroup(
                condition
            );
        }

        // Update
        const updatedEvent = await this.eventRepo.updateOne(
            {
                _id: event.id,
            },
            {
                $set: {
                    name,
                    description,
                    startedAt,
                    endedAt,
                    condition,
                    rewardDistributionType,
                    rewards,
                    updatedBy,
                },
                $push: {
                    histories: {
                        event,
                    },
                },
            }
        );
        return EventMapper.toModel(updatedEvent);
    }

    // Find one event or throw error
    async findOneOrThrowById(id: string) {
        const event = await this.eventRepo.findOne({ _id: id });
        if (!event) {
            throw new RpcException({
                statusCode: HttpStatus.NOT_FOUND,
                message: "이벤트를 찾을 수 없습니다.",
            });
        }
        return EventMapper.toModel(event);
    }

    // Find all events
    async findAll(query: FindAllEventsQuery) {
        const { skip, take, startedAt, endedAt, name, status } = query;

        // Check date between
        if (startedAt && endedAt) {
            if (new Date(startedAt).getTime() >= new Date(endedAt).getTime()) {
                throw new RpcException({
                    statusCode: HttpStatus.BAD_REQUEST,
                    message: "시작 시간이 종료 시간보다 이전이어야 합니다.",
                });
            }
        }

        const events = await this.eventRepo.findPaginated(
            {
                ...(startedAt
                    ? {
                          startedAt: {
                              $gte: startedAt,
                          },
                      }
                    : {}),
                ...(endedAt ? { endedAt: { $lte: endedAt } } : {}),
                ...(name ? { name } : {}),
                ...(status ? { status } : {}),
            },
            { skip, take }
        );
        return events.map(EventMapper.toModel);
    }
}
