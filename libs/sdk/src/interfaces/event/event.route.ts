import { ApiRoute, UserRole } from "@app/sdk";
import { EventApi } from "./event.api";

/**
 * Event API Specification
 * EventController 또는 Client 실제 호출 서비스 구현 시 이용
 */
export const EventRoute: ApiRoute<EventApi, UserRole> = {
    apiTags: "Event",
    pathPrefix: "", // MSA 미사용
    create: {
        method: "POST",
        subRoute: "/create",
        roles: [UserRole.OPERATOR],
        description: ["이벤트 생성"],
    },
    update: {
        method: "PUT",
        subRoute: "/update/:id",
        roles: [UserRole.OPERATOR],
        description: ["이벤트 수정"],
    },
    findOne: {
        method: "GET",
        subRoute: "/:id",
        roles: [],
        description: ["이벤트 조회"],
    },
    findAll: {
        method: "GET",
        subRoute: "/",
        roles: [],
        description: ["이벤트 목록 조회"],
    },
    settingRewards: {
        method: "POST",
        subRoute: "/:id/rewards",
        roles: [UserRole.OPERATOR],
        description: ["이벤트 보상 세팅"],
    },
    requestReward: {
        method: "POST",
        subRoute: "/:id/reward-request",
        roles: [UserRole.USER],
        description: ["이벤트 보상 요청"],
    },
    approveRewardRequest: {
        method: "POST",
        subRoute: "/:id/reward-request/:rewardRequestId/approve",
        roles: [UserRole.OPERATOR],
        description: ["이벤트 보상 요청 승인"],
    },
    rejectRewardRequest: {
        method: "POST",
        subRoute: "/:id/reward-request/:rewardRequestId/reject",
        roles: [UserRole.OPERATOR],
        description: ["이벤트 보상 요청 거절"],
    },
    findOneRewardRequest: {
        method: "GET",
        subRoute: "/:id/reward-request/:rewardRequestId",
        roles: [UserRole.USER, UserRole.OPERATOR],
        description: ["이벤트 보상 요청 조회"],
    },
    findAllRewardRequests: {
        method: "GET",
        subRoute: "/:id/reward-requests",
        roles: [UserRole.USER, UserRole.OPERATOR, UserRole.AUDITOR],
        description: ["이벤트 보상 요청 목록 조회"],
    },
};
