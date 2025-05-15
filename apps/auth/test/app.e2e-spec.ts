import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { AuthModule } from "./../src/auth.module";
import { AuthRoute } from "@app/sdk";
import { User } from "../src/schemas/user.schema";
import { faker } from "@faker-js/faker";
import { RegisterInputDto } from "../src/dto/body/register-input.dto";
import { CommonResponseDto } from "@app/common";

describe("AuthController (e2e)", () => {
    let app: INestApplication;

    // Test variables
    const user: Pick<User, "email" | "password" | "nickname"> = {
        email: faker.internet.email(),
        password: faker.internet.password(),
        nickname: faker.person.fullName(),
    };

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AuthModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    it("should check health", async () => {
        const response = await request(app.getHttpServer()).get("/");

        expect(response).toBeDefined();
        expect(response.status).toBe(200);

        const body = response.text;
        expect(body).toContain("Hello, World!");
    });

    it("register", async () => {
        const registerInputDto: RegisterInputDto = {
            email: user.email,
            password: user.password,
            nickname: user.nickname,
        };

        const response = await request(app.getHttpServer())
            .post(AuthRoute.register.subRoute)
            .send(registerInputDto);

        expect(response).toBeDefined();
        expect(response.status).toBe(201);

        const body = response.body as CommonResponseDto;
        expect(body.success).toBe(true);
    });
});
