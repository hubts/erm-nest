import { Test, TestingModule } from "@nestjs/testing";
import { HttpStatus } from "@nestjs/common";
import { faker } from "@faker-js/faker";
import {
    UserRole,
    AuthRoute,
    EventRoute,
    EventConditionModel,
    EventModel,
    EventConditionSet,
    SimpleUserModel,
    EventUserLoggingModel,
    EventRewardRequestModel,
} from "@app/sdk";
import { join } from "path";
import {
    AuthTokenDto,
    LoginInputDto,
    RefreshInputDto,
    RegisterAsInputDto,
    RegisterInputDto,
} from "apps/gateway/src/microservices/auth/dto";
import { HttpModule, HttpService } from "@nestjs/axios";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { CommonResponseDto, PaginatedDto } from "@app/common";
import { AxiosError } from "axios";
import {
    CreateEventConditionInputDto,
    CreateEventInputDto,
    CreateEventUserLoggingInputDto,
    RejectRewardRequestInputDto,
} from "apps/gateway/src/microservices/event/dto";

jest.setTimeout(60000);

describe("Workflow (e2e)", () => {
    let httpService: HttpService;
    let configService: ConfigService;
    let gatewayEndpoint: string;
    let gatewayPrefix: string;
    let gatewayAdminSecret: string;

    /**
     * Global Variables for Test
     */

    let userId: string;
    const user: RegisterInputDto = {
        email: faker.internet.email(),
        password: faker.internet.password(),
        nickname: faker.person.fullName(),
    };
    const others: RegisterAsInputDto[] = [
        {
            email: faker.internet.email(),
            password: faker.internet.password(),
            role: UserRole.OPERATOR,
        },
        {
            email: faker.internet.email(),
            password: faker.internet.password(),
            role: UserRole.AUDITOR,
        },
        {
            email: faker.internet.email(),
            password: faker.internet.password(),
            role: UserRole.ADMIN,
        },
    ];

    let authToken: string;
    let refreshToken: string;
    let operatorToken: string;
    let auditorToken: string;
    let adminToken: string;

    const eventConditionExample = {
        friendInvite: "friend_invite",
        consecutiveLogin: "consecutive_login",
        questCleared: "quest_cleared",
    };
    const eventConditionInputs: CreateEventConditionInputDto[] = [
        {
            fieldName: eventConditionExample.friendInvite,
            displayName: "테스트: 친구 초대",
            type: "number",
        },
        {
            fieldName: eventConditionExample.consecutiveLogin,
            displayName: "테스트: 연속 로그인",
            type: "number",
        },
        {
            fieldName: eventConditionExample.questCleared,
            displayName: "테스트: 퀘스트 클리어 결과",
            type: "string",
        },
    ];
    const eventConditions: Partial<EventConditionModel>[] = [];
    const events: Partial<EventModel>[] = [];
    let rewardRequests: Partial<EventRewardRequestModel>[] = [];

    function getUrl(route: string): string {
        return new URL(join(gatewayPrefix, route), gatewayEndpoint).toString();
    }

    function logError(e: unknown, route: string) {
        if (e instanceof AxiosError) {
            console.error("Error URL:", getUrl(route));
            console.error("Error Response:", JSON.stringify(e.response?.data));
        } else {
            console.error(e);
        }
        expect(false).toBe(true);
    }

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [
                HttpModule.register({
                    timeout: 5000,
                }),
                ConfigModule.forRoot({
                    envFilePath: "./test/.env.test",
                }),
            ],
        }).compile();

        httpService = moduleFixture.get<HttpService>(HttpService);
        configService = moduleFixture.get<ConfigService>(ConfigService);
    });

    it("환경변수 체크", () => {
        gatewayEndpoint = configService.get<string>("GATEWAY_ENDPOINT");
        expect(gatewayEndpoint).toBeDefined();

        gatewayPrefix = configService.get<string>("GATEWAY_ENDPOINT_PREFIX");
        expect(gatewayPrefix).toBeDefined();

        gatewayAdminSecret = configService.get<string>("GATEWAY_ADMIN_SECRET");
        expect(gatewayAdminSecret).toBeDefined();
    });

    describe("인증 서비스 플로우", () => {
        it("유저가 회원가입을 진행한다.", async () => {
            const registerRoute = join(
                AuthRoute.pathPrefix,
                AuthRoute.register.subRoute
            );
            const body: RegisterInputDto = {
                email: user.email,
                password: user.password,
                nickname: user.nickname,
            };

            try {
                const response = await httpService.axiosRef.post<
                    CommonResponseDto<SimpleUserModel>
                >(getUrl(registerRoute), body);
                expect(response).toBeDefined();
                expect(response.status).toBe(HttpStatus.CREATED);
                expect(response.data.success).toBe(true);
                expect(response.data.data.email).toEqual(user.email);
                userId = response.data.data.id;
                expect(userId).toBeDefined();
            } catch (e) {
                logError(e, registerRoute);
            }
        });

        it("유저가 로그인을 진행한다.", async () => {
            const loginRoute = join(
                AuthRoute.pathPrefix,
                AuthRoute.login.subRoute
            );
            const body: LoginInputDto = {
                email: user.email,
                password: user.password,
            };

            try {
                const response = await httpService.axiosRef.post<
                    CommonResponseDto<AuthTokenDto>
                >(getUrl(loginRoute), body);
                expect(response).toBeDefined();
                expect(response.status).toBe(HttpStatus.CREATED);
                expect(response.data.success).toBe(true);

                authToken = response.data.data.accessToken;
                expect(authToken).toBeDefined();

                refreshToken = response.data.data.refreshToken;
                expect(refreshToken).toBeDefined();
            } catch (e) {
                logError(e, loginRoute);
            }
        });

        it("유저가 토큰을 갱신한다.", async () => {
            const refreshRoute = join(
                AuthRoute.pathPrefix,
                AuthRoute.refresh.subRoute
            );
            const body: RefreshInputDto = {
                refreshToken,
            };

            try {
                const response = await httpService.axiosRef.post<
                    CommonResponseDto<AuthTokenDto>
                >(getUrl(refreshRoute), body);
                expect(response).toBeDefined();
                expect(response.status).toBe(HttpStatus.CREATED);
                expect(response.data.success).toBe(true);

                authToken = response.data.data.accessToken;
                expect(authToken).toBeDefined();

                refreshToken = response.data.data.refreshToken;
                expect(refreshToken).toBeDefined();
            } catch (e) {
                logError(e, refreshRoute);
            }
        });

        it("유저가 로그아웃한다.", async () => {
            const logoutRoute = join(
                AuthRoute.pathPrefix,
                AuthRoute.logout.subRoute
            );
            try {
                const response = await httpService.axiosRef.post<
                    CommonResponseDto<void>
                >(
                    getUrl(logoutRoute),
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${authToken}`,
                        },
                    }
                );
                expect(response).toBeDefined();
                expect(response.status).toBe(HttpStatus.CREATED);
                expect(response.data.success).toBe(true);
            } catch (e) {
                logError(e, logoutRoute);
            }
        });

        it("유저가 로그아웃하면, 갱신할 수 없다.", async () => {
            const refreshRoute = join(
                AuthRoute.pathPrefix,
                AuthRoute.refresh.subRoute
            );
            const body: RefreshInputDto = {
                refreshToken,
            };

            try {
                await httpService.axiosRef.post<
                    CommonResponseDto<AuthTokenDto>
                >(getUrl(refreshRoute), body);
            } catch (e) {
                if (e instanceof AxiosError) {
                    expect(e.response?.status).toBe(HttpStatus.NOT_FOUND);
                } else {
                    logError(e, refreshRoute);
                }
            }
        });

        it("유저가 다시 로그인한다.", async () => {
            const loginRoute = join(
                AuthRoute.pathPrefix,
                AuthRoute.login.subRoute
            );
            const body: LoginInputDto = {
                email: user.email,
                password: user.password,
            };

            try {
                const response = await httpService.axiosRef.post<
                    CommonResponseDto<AuthTokenDto>
                >(getUrl(loginRoute), body);
                expect(response).toBeDefined();
                expect(response.status).toBe(HttpStatus.CREATED);
                expect(response.data.success).toBe(true);

                authToken = response.data.data.accessToken;
                expect(authToken).toBeDefined();

                refreshToken = response.data.data.refreshToken;
                expect(refreshToken).toBeDefined();
            } catch (e) {
                logError(e, loginRoute);
            }
        });

        it("운영자, 감사자, 관리자가 회원가입한다.", async () => {
            const registerAsRoute = join(
                AuthRoute.pathPrefix,
                AuthRoute.registerAs.subRoute
            );
            for (const other of others) {
                const body: RegisterAsInputDto = {
                    email: other.email,
                    password: other.password,
                    role: other.role,
                };

                try {
                    const response = await httpService.axiosRef.post<
                        CommonResponseDto<void>
                    >(getUrl(registerAsRoute), body, {
                        headers: {
                            secret: gatewayAdminSecret,
                        },
                    });
                    expect(response).toBeDefined();
                    expect(response.status).toBe(HttpStatus.CREATED);
                    expect(response.data.success).toBe(true);
                } catch (e) {
                    logError(e, registerAsRoute);
                }
            }
        });

        it("운영자, 감사자, 관리자가 로그인한다.", async () => {
            const loginRoute = join(
                AuthRoute.pathPrefix,
                AuthRoute.login.subRoute
            );
            for (const other of others) {
                const body: LoginInputDto = {
                    email: other.email,
                    password: other.password,
                };

                try {
                    const response = await httpService.axiosRef.post<
                        CommonResponseDto<AuthTokenDto>
                    >(getUrl(loginRoute), body);
                    expect(response).toBeDefined();
                    expect(response.status).toBe(HttpStatus.CREATED);
                    expect(response.data.success).toBe(true);

                    if (other.role === UserRole.OPERATOR) {
                        operatorToken = response.data.data.accessToken;
                        expect(operatorToken).toBeDefined();
                    } else if (other.role === UserRole.AUDITOR) {
                        auditorToken = response.data.data.accessToken;
                        expect(auditorToken).toBeDefined();
                    } else if (other.role === UserRole.ADMIN) {
                        adminToken = response.data.data.accessToken;
                        expect(adminToken).toBeDefined();
                    }
                } catch (e) {
                    logError(e, loginRoute);
                }
            }
        });
    });

    describe("이벤트 서비스 플로우", () => {
        it("운영자는 이벤트 조건 목록을 미리 조회한다. (중복방지)", async () => {
            const findAllEventConditionsRoute = join(
                EventRoute.pathPrefix,
                EventRoute.findAllEventConditions.subRoute
            );
            try {
                const response = await httpService.axiosRef.get<
                    CommonResponseDto<PaginatedDto<EventConditionModel>>
                >(getUrl(findAllEventConditionsRoute), {
                    params: {
                        displayName: "테스트:",
                    },
                    headers: {
                        Authorization: `Bearer ${operatorToken}`,
                    },
                });
                expect(response).toBeDefined();
                expect(response.status).toBe(HttpStatus.OK);
                expect(response.data.success).toBe(true);

                response.data.data.list.map(item =>
                    eventConditions.push({
                        id: item.id,
                        ...item,
                    })
                );
            } catch (e) {
                logError(e, findAllEventConditionsRoute);
            }
        });

        it("운영자는 이벤트 조건을 생성한다.", async () => {
            for (const condition of eventConditionInputs) {
                const found = eventConditions.find(
                    d => d.fieldName === condition.fieldName
                );
                if (found) {
                    continue;
                }

                const createEventConditionRoute = join(
                    EventRoute.pathPrefix,
                    EventRoute.createEventCondition.subRoute
                );
                const body = condition;
                try {
                    const response = await httpService.axiosRef.post<
                        CommonResponseDto<void>
                    >(getUrl(createEventConditionRoute), body, {
                        headers: {
                            Authorization: `Bearer ${operatorToken}`,
                        },
                    });
                    expect(response).toBeDefined();
                    expect(response.status).toBe(HttpStatus.CREATED);
                    expect(response.data.success).toBe(true);
                } catch (e) {
                    logError(e, createEventConditionRoute);
                }
            }
        });

        it("운영자는 이벤트 조건 목록을 조회한다.", async () => {
            const findAllEventConditionsRoute = join(
                EventRoute.pathPrefix,
                EventRoute.findAllEventConditions.subRoute
            );
            try {
                const response = await httpService.axiosRef.get<
                    CommonResponseDto<PaginatedDto<EventConditionModel>>
                >(getUrl(findAllEventConditionsRoute), {
                    headers: {
                        Authorization: `Bearer ${operatorToken}`,
                    },
                });
                expect(response).toBeDefined();
                expect(response.status).toBe(HttpStatus.OK);
                expect(response.data.success).toBe(true);
                expect(response.data.data.size).toBeGreaterThanOrEqual(
                    eventConditionInputs.length
                );

                response.data.data.list.map(item => {
                    if (
                        eventConditions.find(
                            d => d.fieldName === item.fieldName
                        )
                    ) {
                        return;
                    }
                    eventConditions.push({
                        id: item.id,
                        ...item,
                    });
                });
            } catch (e) {
                logError(e, findAllEventConditionsRoute);
            }
        });

        it("운영자는 이벤트 3건을 생성한다.", async () => {
            const createEventRoute = join(
                EventRoute.pathPrefix,
                EventRoute.create.subRoute
            );
            const eventData: CreateEventInputDto[] = [
                {
                    name: "친구 초대 이벤트",
                    description: "친구를 5명 이상 초대하세요",
                    startedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
                    endedAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                    rewardDistributionType: "auto",
                    condition: {
                        operator: "and",
                        conditions: [
                            {
                                leftOperand: {
                                    id: eventConditions[0].id,
                                },
                                operator: "gte",
                                rightOperand: 5,
                            },
                        ],
                    },
                    rewards: [{ name: "포인트", type: "point", amount: 1000 }],
                    status: "active",
                },
                {
                    name: "연속 로그인 이벤트",
                    description: "7일 이상 연속 로그인하세요",
                    startedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
                    endedAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
                    rewardDistributionType: "auto",
                    condition: {
                        operator: "and",
                        conditions: [
                            {
                                leftOperand: {
                                    id: eventConditions[1].id,
                                },
                                operator: "gte",
                                rightOperand: 7,
                            },
                        ],
                    },
                    rewards: [{ name: "포인트", type: "point", amount: 2000 }],
                    status: "active",
                },
                {
                    name: "퀘스트 클리어 이벤트",
                    description:
                        "3일 이상 연속 로그인하고, 퀘스트를 클리어하세요",
                    startedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
                    endedAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                    rewardDistributionType: "manual",
                    condition: {
                        operator: "and",
                        conditions: [
                            {
                                leftOperand: {
                                    id: eventConditions[0].id,
                                },
                                operator: "gte",
                                rightOperand: 3,
                            },
                            {
                                leftOperand: {
                                    id: eventConditions[2].id,
                                },
                                operator: "eq",
                                rightOperand: "완료",
                            },
                        ],
                    },
                    rewards: [
                        { name: "아이템", type: "item", amount: 1 },
                        { name: "캐시", type: "cash", amount: 2000 },
                    ],
                    status: "active",
                },
            ];

            for (const event of eventData) {
                try {
                    const response =
                        await httpService.axiosRef.post<CommonResponseDto>(
                            getUrl(createEventRoute),
                            event,
                            {
                                headers: {
                                    Authorization: `Bearer ${operatorToken}`,
                                },
                            }
                        );
                    expect(response).toBeDefined();
                    expect(response.status).toBe(HttpStatus.CREATED);
                    expect(response.data.success).toBe(true);
                } catch (e) {
                    logError(e, createEventRoute);
                }
            }
        });

        it("운영자는 이벤트 목록을 조회하고, 상세를 조회한다.", async () => {
            const findAllEventRoute = join(
                EventRoute.pathPrefix,
                EventRoute.findAll.subRoute
            );
            try {
                const response = await httpService.axiosRef.get<
                    CommonResponseDto<PaginatedDto<EventModel>>
                >(getUrl(findAllEventRoute));
                expect(response).toBeDefined();
                expect(response.status).toBe(HttpStatus.OK);
                expect(response.data.success).toBe(true);
                expect(response.data.data.list.length).toBeGreaterThanOrEqual(
                    3
                );
                response.data.data.list.map(item => events.push(item));

                const event = response.data.data.list[0];
                const findOneEventRoute = join(
                    EventRoute.pathPrefix,
                    EventRoute.findOne.subRoute.replace(":id", event.id)
                );
                const detailResponse = await httpService.axiosRef.get<
                    CommonResponseDto<EventModel>
                >(getUrl(findOneEventRoute));
                expect(detailResponse).toBeDefined();
                expect(detailResponse.status).toBe(HttpStatus.OK);
                expect(detailResponse.data.success).toBe(true);
                expect(detailResponse.data.data.id).toBe(event.id);
            } catch (e) {
                logError(e, findAllEventRoute);
            }
        });

        it("운영자는 친구 초대 이벤트의 조건을 수정한다.", async () => {
            const eventId = events[0].id;
            const updateEventRoute = join(
                EventRoute.pathPrefix,
                EventRoute.update.subRoute.replace(":id", eventId)
            );
            const updateData = {
                rewardDistributionType: "manual",
                condition: {
                    operator: "and",
                    conditions: [
                        {
                            leftOperand: { id: eventConditions[0].id },
                            operator: "gte",
                            rightOperand: 7,
                        },
                    ],
                },
            };

            try {
                const response = await httpService.axiosRef.patch<
                    CommonResponseDto<PaginatedDto<EventModel>>
                >(getUrl(updateEventRoute), updateData, {
                    headers: {
                        Authorization: `Bearer ${operatorToken}`,
                    },
                });
                expect(response).toBeDefined();
                expect(response.status).toBe(HttpStatus.OK);
                expect(response.data.success).toBe(true);

                const findOneEventRoute = join(
                    EventRoute.pathPrefix,
                    EventRoute.findOne.subRoute.replace(":id", eventId)
                );
                const detailResponse = await httpService.axiosRef.get<
                    CommonResponseDto<EventModel>
                >(getUrl(findOneEventRoute));
                expect(detailResponse).toBeDefined();
                expect(detailResponse.status).toBe(HttpStatus.OK);
                expect(detailResponse.data.success).toBe(true);
                expect(
                    (
                        detailResponse.data.data.condition
                            .conditions[0] as EventConditionSet
                    ).rightOperand
                ).toBe(7);
            } catch (e) {
                logError(e, updateEventRoute);
            }
        });

        it("운영자는 퀘스트 클리어 이벤트의 보상을 수정한다.", async () => {
            const eventId = events[2].id;
            const updateEventRoute = join(
                EventRoute.pathPrefix,
                EventRoute.update.subRoute.replace(":id", eventId)
            );
            const updateData = {
                rewards: [
                    { name: "아이템", type: "item", amount: 1 },
                    { name: "캐시", type: "cash", amount: 3000 },
                ],
            };

            try {
                const response = await httpService.axiosRef.patch<
                    CommonResponseDto<PaginatedDto<EventModel>>
                >(getUrl(updateEventRoute), updateData, {
                    headers: {
                        Authorization: `Bearer ${operatorToken}`,
                    },
                });
                expect(response).toBeDefined();
                expect(response.status).toBe(HttpStatus.OK);
                expect(response.data.success).toBe(true);

                const findOneEventRoute = join(
                    EventRoute.pathPrefix,
                    EventRoute.findOne.subRoute.replace(":id", eventId)
                );
                const detailResponse = await httpService.axiosRef.get<
                    CommonResponseDto<EventModel>
                >(getUrl(findOneEventRoute));
                expect(detailResponse).toBeDefined();
                expect(detailResponse.status).toBe(HttpStatus.OK);
                expect(detailResponse.data.success).toBe(true);
                expect(
                    detailResponse.data.data.rewards.find(
                        r => r.type === "cash"
                    )?.amount
                ).toBe(3000);
            } catch (e) {
                logError(e, updateEventRoute);
            }
        });

        it("시스템에서 유저의 이벤트 행동 예시 로그를 누적한다.", async () => {
            const createLoggingRoute = join(
                EventRoute.pathPrefix,
                EventRoute.createEventUserLogging.subRoute
            );
            const loggings: CreateEventUserLoggingInputDto[] = [
                {
                    userId,
                    fieldName: eventConditionExample.friendInvite,
                    value: 6,
                },
                {
                    userId,
                    fieldName: eventConditionExample.consecutiveLogin,
                    value: 13,
                },
                {
                    userId,
                    fieldName: eventConditionExample.questCleared,
                    value: "완료",
                },
            ];
            for (const logging of loggings) {
                try {
                    const response =
                        await httpService.axiosRef.post<CommonResponseDto>(
                            getUrl(createLoggingRoute),
                            logging,
                            {
                                headers: {
                                    Authorization: `Bearer ${adminToken}`,
                                },
                            }
                        );
                    expect(response).toBeDefined();
                    expect(response.status).toBe(HttpStatus.CREATED);
                    expect(response.data.success).toBe(true);
                } catch (e) {
                    logError(e, createLoggingRoute);
                }
            }
        });

        it("시스템에서 유저의 이벤트 행동 예시 로그 목록을 조회한다.", async () => {
            const findAllLoggingsRoute = join(
                EventRoute.pathPrefix,
                EventRoute.findAllEventUserLoggings.subRoute
            );
            try {
                const response = await httpService.axiosRef.get<
                    CommonResponseDto<PaginatedDto<EventUserLoggingModel>>
                >(getUrl(findAllLoggingsRoute), {
                    params: {
                        userId,
                    },
                    headers: {
                        Authorization: `Bearer ${adminToken}`,
                    },
                });
                expect(response).toBeDefined();
                expect(response.status).toBe(HttpStatus.OK);
                expect(response.data.success).toBe(true);
                expect(response.data.data.size).toBeGreaterThanOrEqual(3);
            } catch (e) {
                logError(e, findAllLoggingsRoute);
            }
        });

        it("유저가 모든 이벤트들에 대해 보상을 요청한다.", async () => {
            for (const event of events) {
                const createRewardRequestRoute = join(
                    EventRoute.pathPrefix,
                    EventRoute.requestReward.subRoute.replace(":id", event.id)
                );
                try {
                    const response =
                        await httpService.axiosRef.post<CommonResponseDto>(
                            getUrl(createRewardRequestRoute),
                            {},
                            {
                                headers: {
                                    Authorization: `Bearer ${authToken}`,
                                },
                            }
                        );
                    expect(response).toBeDefined();
                    expect(response.status).toBe(HttpStatus.CREATED);
                    expect(response.data.success).toBe(true);
                } catch (e) {
                    logError(e, createRewardRequestRoute);
                }
            }
        });

        it("운영자는 요청된 이벤트 보상 목록을 조회한다.", async () => {
            const findAllRewardRequestRoute = join(
                EventRoute.pathPrefix,
                EventRoute.findAllRewardRequests.subRoute
            );
            try {
                const response = await httpService.axiosRef.get<
                    CommonResponseDto<PaginatedDto<EventRewardRequestModel>>
                >(getUrl(findAllRewardRequestRoute), {
                    headers: {
                        Authorization: `Bearer ${operatorToken}`,
                    },
                });
                expect(response).toBeDefined();
                expect(response.status).toBe(HttpStatus.OK);
                expect(response.data.success).toBe(true);
                expect(response.data.data.size).toBeGreaterThanOrEqual(3);

                response.data.data.list.map(d => rewardRequests.push(d));
            } catch (e) {
                logError(e, findAllRewardRequestRoute);
            }
        });

        it("운영자는 퀘스트 클리어 이벤트에 대한 보상 요청을 직접 거절한다.", async () => {
            const rewardRequestId = rewardRequests.find(
                d => d.eventId === events[2].id
            ).id;
            const rejectRewardRequestRoute = join(
                EventRoute.pathPrefix,
                EventRoute.rejectRewardRequest.subRoute.replace(
                    ":id",
                    rewardRequestId
                )
            );
            const body: RejectRewardRequestInputDto = {
                reason: "보상 보류 상태로 거절",
            };

            try {
                const response =
                    await httpService.axiosRef.post<CommonResponseDto>(
                        getUrl(rejectRewardRequestRoute),
                        body,
                        {
                            headers: {
                                Authorization: `Bearer ${operatorToken}`,
                            },
                        }
                    );
                expect(response).toBeDefined();
                expect(response.status).toBe(HttpStatus.CREATED);
                expect(response.data.success).toBe(true);
            } catch (e) {
                logError(e, rejectRewardRequestRoute);
            }
        });

        it("유저가 이미 승인된 이벤트에 대하여 다시 보상 요청할 수 없다.", async () => {
            const rewardRequestId = rewardRequests.find(
                d => d.eventId === events[1].id
            ).id;
            const findOneRewardRequestRoute = join(
                EventRoute.pathPrefix,
                EventRoute.findOneRewardRequest.subRoute.replace(
                    ":id",
                    rewardRequestId
                )
            );
            try {
                const response = await httpService.axiosRef.get<
                    CommonResponseDto<EventRewardRequestModel>
                >(getUrl(findOneRewardRequestRoute), {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                });
                expect(response).toBeDefined();
                expect(response.status).toBe(HttpStatus.OK);
                expect(response.data.success).toBe(true);
                expect(response.data.data.status).toBe("approved");
            } catch (e) {
                logError(e, findOneRewardRequestRoute);
            }

            const eventId = events[1].id;
            const requestRewardRoute = join(
                EventRoute.pathPrefix,
                EventRoute.requestReward.subRoute.replace(":id", eventId)
            );
            try {
                await httpService.axiosRef.post<CommonResponseDto>(
                    getUrl(requestRewardRoute),
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${authToken}`,
                        },
                    }
                );
            } catch (e) {
                if (e instanceof AxiosError) {
                    expect(e.response?.status).toBe(HttpStatus.BAD_REQUEST);
                } else {
                    logError(e, requestRewardRoute);
                }
            }
        });

        it("시스템에서 유저의 이벤트 행동 예시 로그를 추가로 누적한다.", async () => {
            const createLoggingRoute = join(
                EventRoute.pathPrefix,
                EventRoute.createEventUserLogging.subRoute
            );
            const logging: CreateEventUserLoggingInputDto = {
                userId,
                fieldName: eventConditionExample.friendInvite,
                value: 7,
            };
            try {
                const response =
                    await httpService.axiosRef.post<CommonResponseDto>(
                        getUrl(createLoggingRoute),
                        logging,
                        {
                            headers: {
                                Authorization: `Bearer ${adminToken}`,
                            },
                        }
                    );
                expect(response).toBeDefined();
                expect(response.status).toBe(HttpStatus.CREATED);
                expect(response.data.success).toBe(true);
            } catch (e) {
                logError(e, createLoggingRoute);
            }
        });

        it("유저가 친구 초대 이벤트에 대해 다시 보상을 요청한다.", async () => {
            const eventId = events[0].id;
            const createRewardRequestRoute = join(
                EventRoute.pathPrefix,
                EventRoute.requestReward.subRoute.replace(":id", eventId)
            );
            try {
                const response =
                    await httpService.axiosRef.post<CommonResponseDto>(
                        getUrl(createRewardRequestRoute),
                        {},
                        {
                            headers: {
                                Authorization: `Bearer ${authToken}`,
                            },
                        }
                    );
                expect(response).toBeDefined();
                expect(response.status).toBe(HttpStatus.CREATED);
                expect(response.data.success).toBe(true);
            } catch (e) {
                logError(e, createRewardRequestRoute);
            }
        });

        it("운영자는 다시 요청된 이벤트 보상 목록을 조회한다.", async () => {
            const findAllRewardRequestRoute = join(
                EventRoute.pathPrefix,
                EventRoute.findAllRewardRequests.subRoute
            );
            try {
                const response = await httpService.axiosRef.get<
                    CommonResponseDto<PaginatedDto<EventRewardRequestModel>>
                >(getUrl(findAllRewardRequestRoute), {
                    headers: {
                        Authorization: `Bearer ${operatorToken}`,
                    },
                });
                expect(response).toBeDefined();
                expect(response.status).toBe(HttpStatus.OK);
                expect(response.data.success).toBe(true);
                expect(response.data.data.size).toBeGreaterThanOrEqual(3);

                // 내용 갱신
                rewardRequests = [];
                response.data.data.list.map(d => rewardRequests.push(d));
            } catch (e) {
                logError(e, findAllRewardRequestRoute);
            }
        });

        it("운영자는 친구 초대 이벤트에 대한 보상 요청을 승인한다.", async () => {
            const rewardRequestId = rewardRequests.find(
                d => d.eventId === events[0].id && d.status === "pending"
            ).id;
            const approveRewardRequestRoute = join(
                EventRoute.pathPrefix,
                EventRoute.approveRewardRequest.subRoute.replace(
                    ":id",
                    rewardRequestId
                )
            );
            try {
                const response =
                    await httpService.axiosRef.post<CommonResponseDto>(
                        getUrl(approveRewardRequestRoute),
                        {},
                        {
                            headers: {
                                Authorization: `Bearer ${operatorToken}`,
                            },
                        }
                    );
                expect(response).toBeDefined();
                expect(response.status).toBe(HttpStatus.CREATED);
                expect(response.data.success).toBe(true);
            } catch (e) {
                logError(e, approveRewardRequestRoute);
            }
        });

        it("감사자는 이벤트 보상 요청 로그를 조회한다.", async () => {
            const findAllRewardRequestLogsRoute = join(
                EventRoute.pathPrefix,
                EventRoute.findAllRewardRequests.subRoute
            );
            try {
                const response = await httpService.axiosRef.get<
                    CommonResponseDto<PaginatedDto<EventRewardRequestModel>>
                >(getUrl(findAllRewardRequestLogsRoute), {
                    headers: {
                        Authorization: `Bearer ${auditorToken}`,
                    },
                });
                expect(response).toBeDefined();
                expect(response.status).toBe(HttpStatus.OK);
                expect(response.data.success).toBe(true);
                expect(response.data.data.size).toBeGreaterThanOrEqual(3);
            } catch (e) {
                logError(e, findAllRewardRequestLogsRoute);
            }
        });

        it("관리자는 이벤트 보상 요청 로그를 조회한다.", async () => {
            const findAllRewardRequestLogsRoute = join(
                EventRoute.pathPrefix,
                EventRoute.findAllRewardRequests.subRoute
            );
            try {
                const response = await httpService.axiosRef.get<
                    CommonResponseDto<PaginatedDto<EventRewardRequestModel>>
                >(getUrl(findAllRewardRequestLogsRoute), {
                    headers: {
                        Authorization: `Bearer ${adminToken}`,
                    },
                });
                expect(response).toBeDefined();
                expect(response.status).toBe(HttpStatus.OK);
                expect(response.data.success).toBe(true);
                expect(response.data.data.size).toBeGreaterThanOrEqual(3);
            } catch (e) {
                logError(e, findAllRewardRequestLogsRoute);
            }
        });
    });
});
