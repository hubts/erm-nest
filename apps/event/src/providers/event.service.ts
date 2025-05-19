import { HttpStatus, Injectable } from "@nestjs/common";
import { EventRepository } from "../repositories/event.repository";
import {
    CreateEventInput,
    EventModel,
    FindAllEventsQuery,
    Paginated,
    UpdateEventInput,
    UserModel,
} from "@app/sdk";
import { DateUtil } from "@app/common";
import { EventConditionService } from "./event-condition.service";
import { RpcException } from "@nestjs/microservices";
import { EventMapper, RewardMapper } from "../mapper";
import { FilterQuery } from "mongoose";

@Injectable()
export class EventService {
    constructor(
        private readonly eventRepo: EventRepository,
        private readonly eventConditionService: EventConditionService
    ) {}

    // 이벤트 생성
    async create(creator: UserModel, input: CreateEventInput): Promise<void> {
        const {
            name,
            description,
            startedAt,
            endedAt,
            condition,
            rewardDistributionType,
            rewards,
            status,
        } = input;

        // Check date between
        if (DateUtil.isAfter(startedAt, endedAt)) {
            throw new RpcException({
                statusCode: HttpStatus.BAD_REQUEST,
                message: "이벤트 시작 시간은 종료 시간보다 이전이어야 합니다.",
            });
        }

        // Check condition
        await this.eventConditionService.assertInvalidConditionGroup(condition);

        // Save
        await this.eventRepo.create({
            name,
            description,
            startedAt,
            endedAt,
            condition,
            rewardDistributionType,
            status,
            createdBy: creator.id,
            rewards: rewards.map(RewardMapper.createToModel),
        });
    }

    // Assert if the event is ~
    assertEventIs(
        event: EventModel,
        type: "ongoing" | "inactive" | "ended"
    ): void {
        switch (type) {
            case "ongoing":
                if (
                    DateUtil.isBetween(
                        new Date(),
                        event.startedAt,
                        event.endedAt
                    )
                ) {
                    throw new RpcException({
                        statusCode: HttpStatus.BAD_REQUEST,
                        message: "이벤트가 진행 중입니다.",
                    });
                }
                break;
            case "inactive":
                if (event.status === "inactive") {
                    throw new RpcException({
                        statusCode: HttpStatus.BAD_REQUEST,
                        message: "이벤트가 비활성화되었습니다.",
                    });
                }
                break;
            case "ended":
                if (DateUtil.isAfter(new Date(), event.endedAt)) {
                    throw new RpcException({
                        statusCode: HttpStatus.BAD_REQUEST,
                        message: "이벤트가 이미 종료되었습니다.",
                    });
                }
                break;
        }
    }

    // Update the event
    async update(
        updater: UserModel,
        id: string,
        input: UpdateEventInput
    ): Promise<void> {
        const {
            name,
            description,
            startedAt,
            endedAt,
            condition,
            rewardDistributionType,
            rewards,
        } = input;

        // Check
        const event = await this.findOneOrThrowById(id);
        this.assertEventIs(event, "ongoing");
        this.assertEventIs(event, "inactive");
        this.assertEventIs(event, "ended");

        // Check condition
        if (condition && event.condition !== condition) {
            await this.eventConditionService.assertInvalidConditionGroup(
                condition
            );
        }

        // Update
        await this.eventRepo.updateOne(
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
                    updatedBy: updater.id,
                },
                $push: {
                    histories: {
                        event,
                    },
                },
            }
        );
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
    async findAll(query: FindAllEventsQuery): Promise<Paginated<EventModel>> {
        const { skip, take, startedAt, endedAt, name, status } = query;

        // Check date between
        if (startedAt && endedAt) {
            if (DateUtil.isAfter(startedAt, endedAt)) {
                throw new RpcException({
                    statusCode: HttpStatus.BAD_REQUEST,
                    message: "시작 시간이 종료 시간보다 이전이어야 합니다.",
                });
            }
        }

        // Query
        const filter: FilterQuery<Event> = {};
        if (startedAt) {
            filter.startedAt = { $gte: startedAt };
        }
        if (endedAt) {
            filter.endedAt = { $lte: endedAt };
        }
        if (name) {
            filter.name = { $regex: name, $options: "i" };
        }
        if (status) {
            filter.status = status;
        }

        // Find
        const total = await this.eventRepo.count(filter);
        const list = await this.eventRepo.findAllPaginated(filter, {
            skip,
            take,
        });

        return {
            total,
            size: list.length,
            list: list.map(EventMapper.toModel),
        };
    }
}
