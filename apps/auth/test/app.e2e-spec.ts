import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { AuthModule } from "./../src/auth.module";

describe("AuthController (e2e)", () => {
    let app: INestApplication;

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

    it("/ (GET)", async () => {
        const response = await request(app.getHttpServer()).get("/");

        expect(response).toBeDefined();
        expect(response.status).toBe(200);

        const body = response.text;
        expect(body).toContain("Hello, World!");
    });
});
