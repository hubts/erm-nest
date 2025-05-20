import { Test, TestingModule } from "@nestjs/testing";
import { HttpStatus } from "@nestjs/common";
import { faker } from "@faker-js/faker";
import { UserRole, AuthRoute } from "@app/sdk";
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
import { CommonResponseDto } from "@app/common";
import { AxiosError } from "axios";

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

    // const eventConditions: Partial<EventConditionModel>[] = [];
    // const events: Partial<EventModel>[] = [];
    // const rewardRequests: Partial<EventRewardRequestModel>[] = [];

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
                const response =
                    await httpService.axiosRef.post<CommonResponseDto>(
                        getUrl(registerRoute),
                        body
                    );
                expect(response).toBeDefined();
                expect(response.status).toBe(HttpStatus.CREATED);
                expect(response.data.success).toBe(true);
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

    // describe("Event Flow", () => {
    //     it("should create event conditions", async () => {
    //         const conditions = [
    //             {
    //                 fieldName: "friendInvite",
    //                 displayName: "친구 초대",
    //                 type: "number",
    //             },
    //             {
    //                 fieldName: "consecutiveLogin",
    //                 displayName: "연속 로그인",
    //                 type: "number",
    //             },
    //             {
    //                 fieldName: "questCleared",
    //                 displayName: "퀘스트 클리어 여부",
    //                 type: "boolean",
    //             },
    //         ];

    //         for (const condition of conditions) {
    //             const response = await request(app.getHttpServer())
    //                 .post("/event/conditions")
    //                 .set("Authorization", `Bearer ${operatorToken}`)
    //                 .send(condition)
    //                 .expect(201);

    //             expect(response.body.data).toBeDefined();
    //             eventConditions.push(response.body.data);
    //         }
    //     });

    //     it("should get all event conditions", async () => {
    //         const response = await request(app.getHttpServer())
    //             .get("/event/conditions")
    //             .set("Authorization", `Bearer ${operatorToken}`)
    //             .expect(200);

    //         expect(response.body.data.items.length).toBe(3);
    //     });

    //     it("should create events", async () => {
    //         const eventData = [
    //             {
    //                 name: "친구 초대 이벤트",
    //                 description: "친구를 5명 이상 초대하세요",
    //                 startedAt: new Date(),
    //                 endedAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    //                 rewardDistributionType: "auto",
    //                 condition: {
    //                     operator: "and",
    //                     conditions: [
    //                         {
    //                             leftOperand: { id: eventConditions[0].id },
    //                             operator: "gte",
    //                             rightOperand: 5,
    //                         },
    //                     ],
    //                 },
    //                 rewards: [{ name: "포인트", type: "point", amount: 1000 }],
    //                 status: "active",
    //             },
    //             {
    //                 name: "연속 로그인 이벤트",
    //                 description: "7일 이상 연속 로그인하세요",
    //                 startedAt: new Date(),
    //                 endedAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    //                 rewardDistributionType: "auto",
    //                 condition: {
    //                     operator: "and",
    //                     conditions: [
    //                         {
    //                             leftOperand: { id: eventConditions[1].id },
    //                             operator: "gte",
    //                             rightOperand: 7,
    //                         },
    //                     ],
    //                 },
    //                 rewards: [{ name: "포인트", type: "point", amount: 2000 }],
    //                 status: "active",
    //             },
    //             {
    //                 name: "퀘스트 클리어 이벤트",
    //                 description:
    //                     "3일 이상 연속 로그인하고 퀘스트를 클리어하세요",
    //                 startedAt: new Date(),
    //                 endedAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    //                 rewardDistributionType: "manual",
    //                 condition: {
    //                     operator: "and",
    //                     conditions: [
    //                         {
    //                             leftOperand: { id: eventConditions[1].id },
    //                             operator: "gte",
    //                             rightOperand: 3,
    //                         },
    //                         {
    //                             leftOperand: { id: eventConditions[2].id },
    //                             operator: "eq",
    //                             rightOperand: true,
    //                         },
    //                     ],
    //                 },
    //                 rewards: [
    //                     { name: "아이템", type: "item", amount: 1 },
    //                     { name: "캐시", type: "cash", amount: 2000 },
    //                 ],
    //                 status: "active",
    //             },
    //         ];

    //         for (const event of eventData) {
    //             const response = await request(app.getHttpServer())
    //                 .post("/event")
    //                 .set("Authorization", `Bearer ${operatorToken}`)
    //                 .send(event)
    //                 .expect(201);

    //             expect(response.body.data).toBeDefined();
    //             events.push(response.body.data);
    //         }
    //     });

    //     it("should get all events", async () => {
    //         const response = await request(app.getHttpServer())
    //             .get("/event")
    //             .set("Authorization", `Bearer ${operatorToken}`)
    //             .expect(200);

    //         expect(response.body.data.items.length).toBe(3);
    //     });

    //     it("should update friend invite event condition", async () => {
    //         const updateData = {
    //             condition: {
    //                 operator: "and",
    //                 conditions: [
    //                     {
    //                         leftOperand: { id: eventConditions[0].id },
    //                         operator: "gte",
    //                         rightOperand: 7,
    //                     },
    //                 ],
    //             },
    //         };

    //         await request(app.getHttpServer())
    //             .patch(`/event/${events[0].id}`)
    //             .set("Authorization", `Bearer ${operatorToken}`)
    //             .send(updateData)
    //             .expect(200);
    //     });

    //     it("should update quest clear event reward", async () => {
    //         const updateData = {
    //             rewards: [
    //                 { name: "아이템", type: "item", amount: 1 },
    //                 { name: "캐시", type: "cash", amount: 3000 },
    //             ],
    //         };

    //         await request(app.getHttpServer())
    //             .patch(`/event/${events[2].id}`)
    //             .set("Authorization", `Bearer ${operatorToken}`)
    //             .send(updateData)
    //             .expect(200);
    //     });

    //     it("should create user event loggings", async () => {
    //         const loggings = [
    //             { userId: users[0].id, fieldName: "friendInvite", value: 6 },
    //             {
    //                 userId: users[0].id,
    //                 fieldName: "consecutiveLogin",
    //                 value: 13,
    //             },
    //             { userId: users[0].id, fieldName: "questCleared", value: true },
    //         ];

    //         for (const logging of loggings) {
    //             await request(app.getHttpServer())
    //                 .post("/event/user-logging")
    //                 .set("Authorization", `Bearer ${authToken}`)
    //                 .send(logging)
    //                 .expect(201);
    //         }
    //     });

    //     it("should get user event loggings", async () => {
    //         const response = await request(app.getHttpServer())
    //             .get("/event/user-logging")
    //             .set("Authorization", `Bearer ${authToken}`)
    //             .expect(200);

    //         expect(response.body.data.items.length).toBe(20);
    //     });

    //     it("should request rewards for all events", async () => {
    //         for (const event of events) {
    //             const response = await request(app.getHttpServer())
    //                 .post(`/event/${event.id}/reward-request`)
    //                 .set("Authorization", `Bearer ${authToken}`)
    //                 .expect(201);

    //             expect(response.body.data).toBeDefined();
    //             rewardRequests.push(response.body.data);
    //         }
    //     });

    //     it("should get user reward requests", async () => {
    //         const response = await request(app.getHttpServer())
    //             .get("/event/reward-requests")
    //             .set("Authorization", `Bearer ${authToken}`)
    //             .expect(200);

    //         expect(response.body.data.items.length).toBe(3);
    //         expect(response.body.data.items[0].status).toBe("insufficient");
    //         expect(response.body.data.items[1].status).toBe("approved");
    //         expect(response.body.data.items[2].status).toBe("pending");
    //     });

    //     it("should get all reward requests as operator", async () => {
    //         const response = await request(app.getHttpServer())
    //             .get("/event/reward-requests")
    //             .set("Authorization", `Bearer ${operatorToken}`)
    //             .expect(200);

    //         expect(response.body.data.items.length).toBe(3);
    //     });

    //     it("should reject friend invite event reward request", async () => {
    //         await request(app.getHttpServer())
    //             .post(`/event/reward-requests/${rewardRequests[0].id}/reject`)
    //             .set("Authorization", `Bearer ${operatorToken}`)
    //             .send({ reason: "조건 불충분" })
    //             .expect(200);
    //     });

    //     it("should request quest clear event reward again", async () => {
    //         const response = await request(app.getHttpServer())
    //             .post(`/event/${events[2].id}/reward-request`)
    //             .set("Authorization", `Bearer ${authToken}`)
    //             .expect(201);

    //         expect(response.body.data).toBeDefined();
    //         rewardRequests[2] = response.body.data;
    //     });

    //     it("should approve quest clear event reward request", async () => {
    //         await request(app.getHttpServer())
    //             .post(`/event/reward-requests/${rewardRequests[2].id}/approve`)
    //             .set("Authorization", `Bearer ${operatorToken}`)
    //             .expect(200);
    //     });

    //     it("should get reward request logs as auditor", async () => {
    //         const response = await request(app.getHttpServer())
    //             .get("/event/reward-requests/logs")
    //             .set("Authorization", `Bearer ${auditorToken}`)
    //             .expect(200);

    //         expect(response.body.data.items.length).toBeGreaterThan(0);
    //     });
    // });
});
