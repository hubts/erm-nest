import { ApiRoute, UserRole } from "@app/sdk";
import { EventApi } from "./event.api";

/**
 * Event API Specification
 * EventController 또는 Client 실제 호출 서비스 구현 시 이용
 */
export const EventRoute: ApiRoute<EventApi, UserRole> = {
    apiTags: "Event",
    pathPrefix: "",
    // Event
    create: {
        method: "POST",
        subRoute: "/events",
        roles: ["OPERATOR"],
        description: ["이벤트 생성"],
        cmd: "events.create",
    },
    update: {
        method: "PATCH",
        subRoute: "/events/:id",
        roles: ["OPERATOR"],
        description: ["이벤트 수정"],
        cmd: "events.update",
    },
    findAll: {
        method: "GET",
        subRoute: "/events",
        roles: [],
        description: ["이벤트 목록 조회"],
        cmd: "events.findAll",
    },
    findOne: {
        method: "GET",
        subRoute: "/events/:id",
        roles: [],
        description: ["이벤트 상세 조회"],
        cmd: "events.findOne",
    },
    // Event Condition
    createEventCondition: {
        method: "POST",
        subRoute: "/event-conditions",
        roles: ["OPERATOR"],
        description: ["이벤트 조건(Field) 생성"],
        cmd: "events.createEventCondition",
    },
    findAllEventConditions: {
        method: "GET",
        subRoute: "/event-conditions",
        roles: ["OPERATOR"],
        description: ["이벤트 조건 목록 조회"],
        cmd: "events.findAllEventConditions",
    },
    // Reward Request
    requestReward: {
        method: "POST",
        subRoute: "/events/:id/reward-requests",
        roles: ["USER"],
        description: ["이벤트 보상 요청"],
        cmd: "events.requestReward",
    },
    approveRewardRequest: {
        method: "POST",
        subRoute: "/event-reward-requests/:id/approve",
        roles: ["OPERATOR"],
        description: ["이벤트 보상 요청 승인"],
        cmd: "events.approveRewardRequest",
    },
    rejectRewardRequest: {
        method: "POST",
        subRoute: "/event-reward-requests/:id/reject",
        roles: ["OPERATOR"],
        description: ["이벤트 보상 요청 거절"],
        cmd: "events.rejectRewardRequest",
    },
    findOneRewardRequest: {
        method: "GET",
        subRoute: "/event-reward-requests/:id",
        roles: ["USER", "OPERATOR"],
        description: ["이벤트 보상 요청 상세 조회"],
        cmd: "events.findOneRewardRequest",
    },
    findAllRewardRequests: {
        method: "GET",
        subRoute: "/event-reward-requests",
        roles: ["USER", "OPERATOR", "AUDITOR"],
        description: ["이벤트 보상 요청 목록 조회"],
        cmd: "events.findAllRewardRequests",
    },
    // TEST: Event User Logging - 실제로는 다른 기능에서 축적해야 하는 로그
    createEventUserLogging: {
        method: "POST",
        subRoute: "/event-user-loggings",
        roles: ["USER", "OPERATOR"],
        description: ["이벤트 사용자 로깅 생성"],
        cmd: "events.createEventUserLogging",
    },
    findAllEventUserLoggings: {
        method: "GET",
        subRoute: "/event-user-loggings",
        roles: ["USER", "OPERATOR", "AUDITOR"],
        description: ["이벤트 사용자 로깅 목록 조회"],
        cmd: "events.findAllEventUserLoggings",
    },
};
