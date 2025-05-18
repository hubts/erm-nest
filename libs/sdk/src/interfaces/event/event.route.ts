import { ApiRoute, UserRole } from "@app/sdk";
import { EventApi } from "./event.api";

/**
 * Event API Specification
 * EventController 또는 Client 실제 호출 서비스 구현 시 이용
 */
export const EventRoute: ApiRoute<EventApi, UserRole> = {
    apiTags: "Event",
    pathPrefix: "events",
    create: {
        method: "POST",
        subRoute: "/create",
        roles: ["OPERATOR"],
        description: ["이벤트 생성"],
        cmd: "events.create",
    },
    update: {
        method: "PUT",
        subRoute: "/update/:id",
        roles: ["OPERATOR"],
        description: ["이벤트 수정"],
        cmd: "events.update",
    },
    findOne: {
        method: "GET",
        subRoute: "/:id",
        roles: [],
        description: ["이벤트 조회"],
        cmd: "events.findOne",
    },
    findAll: {
        method: "GET",
        subRoute: "/",
        roles: [],
        description: ["이벤트 목록 조회"],
        cmd: "events.findAll",
    },
    createEventCondition: {
        method: "POST",
        subRoute: "/conditions",
        roles: ["OPERATOR"],
        description: ["이벤트 조건 생성"],
        cmd: "events.createEventCondition",
    },
    findAllEventConditions: {
        method: "GET",
        subRoute: "/conditions",
        roles: ["OPERATOR"],
        description: ["이벤트 조건 목록 조회"],
        cmd: "events.findAllEventConditions",
    },
    settingRewards: {
        method: "POST",
        subRoute: "/:id/rewards",
        roles: ["OPERATOR"],
        description: ["이벤트 보상 세팅"],
        cmd: "events.settingRewards",
    },
    requestReward: {
        method: "POST",
        subRoute: "/:id/reward-request",
        roles: ["USER"],
        description: ["이벤트 보상 요청"],
        cmd: "events.requestReward",
    },
    approveRewardRequest: {
        method: "POST",
        subRoute: "/:id/reward-request/:rewardRequestId/approve",
        roles: ["OPERATOR"],
        description: ["이벤트 보상 요청 승인"],
        cmd: "events.approveRewardRequest",
    },
    rejectRewardRequest: {
        method: "POST",
        subRoute: "/:id/reward-request/:rewardRequestId/reject",
        roles: ["OPERATOR"],
        description: ["이벤트 보상 요청 거절"],
        cmd: "events.rejectRewardRequest",
    },
    findOneRewardRequest: {
        method: "GET",
        subRoute: "/:id/reward-request/:rewardRequestId",
        roles: ["USER", "OPERATOR"],
        description: ["이벤트 보상 요청 조회"],
        cmd: "events.findOneRewardRequest",
    },
    findAllRewardRequests: {
        method: "GET",
        subRoute: "/:id/reward-requests",
        roles: ["USER", "OPERATOR", "AUDITOR"],
        description: ["이벤트 보상 요청 목록 조회"],
        cmd: "events.findAllRewardRequests",
    },
    createEventUserLogging: {
        method: "POST",
        subRoute: "/user-loggings",
        roles: ["USER", "OPERATOR"],
        description: ["이벤트 사용자 로깅 생성"],
        cmd: "events.createEventUserLogging",
    },
    findAllEventUserLoggings: {
        method: "GET",
        subRoute: "/user-loggings",
        roles: ["USER", "OPERATOR", "AUDITOR"],
        description: ["이벤트 사용자 로깅 목록 조회"],
        cmd: "events.findAllEventUserLoggings",
    },
};
