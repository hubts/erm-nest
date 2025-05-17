import { BadRequestException, Injectable } from "@nestjs/common";
import { EventRepository } from "../repositories/event.repository";
import { EventConditionGroup } from "@app/sdk";

@Injectable()
export class EventManagementService {
    constructor(private readonly eventRepository: EventRepository) {}

    async createEvent(data: {
        name: string;
        description: string;
        startedAt: Date;
        endedAt: Date;
        condition: EventConditionGroup;
        rewardDistributionType: "manual" | "auto";
        createdBy: string;
    }) {
        const {
            name,
            description,
            startedAt,
            endedAt,
            condition,
            rewardDistributionType,
            createdBy,
        } = data;

        // Check date between
        if (new Date(startedAt).getTime() >= new Date(endedAt).getTime()) {
            throw new BadRequestException(
                "이벤트 시작 시간은 종료 시간보다 이전이어야 합니다."
            );
        }

        // Check condition
        if (condition.conditions.length === 0) {
            throw new BadRequestException(
                "이벤트 조건은 최소 1개 이상이어야 합니다."
            );
        }

        console.log(data);
    }
}
