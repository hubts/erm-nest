<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

# 이벤트 / 보상 관리 플랫폼 구축

## 👀 Overview

본 프로젝트는 이벤트/보상을 관리하는 시스템을 구축하는 백엔드 프로젝트입니다.

주요 요구사항 목표는 아래와 같습니다.

1. 운영자 또는 관리자가 이벤트를 생성할 때, **이벤트 조건과 보상을 맞춤 설정**할 수 있어야 합니다.
2. 유저가 보상을 요청할 때 **시스템은 해당 조건의 충족을 검사**하고, **설정에 따라 자동으로 보상을 지급**해야 합니다.
3. 관련된 유저 인증 관리, 이벤트 관리, 보상 확인, 관련 로그 확인 기능 등을 포함해야 합니다.

## ⚒️ Technical Stacks

| Key             | Version / Tool             |
| --------------- | -------------------------- |
| Node.js         | ~~18 (Fixed)~~ (하기 참조) |
| NestJS          | Recent (^11.1.1)           |
| Language        | TypeScript                 |
| Architecture    | Microservices(Monorepo)    |
| Package Manager | yarn                       |
| Documentation   | Swagger                    |
| Database        | MongoDB                    |
| Deployment      | Docker, docker-compose     |

> 최신 NestJS `@nestjs/core@^11` 에서 node 버전 20 이상을 요구합니다. [공식](https://docs.nestjs.com/migration-guide#nodejs-v16-and-v18-no-longer-supported)
> 따라서 Dockerfile에 기재한 것처럼 `node:20.12.2` 이미지를 이용하였습니다.

## ✅ Implementation Features

-   [x] Implementing Domains (Gateway, Auth, Event)
-   [x] Microservices (TCP-based)
-   [x] JWT Authentication
-   [x] Swagger Documentation
-   [x] Git version management by `commitizen`
-   [x] Docker-compose Deployment
-   [ ] Interfaces to generate SDK
-   [ ] Custom Logging System

## Architecture

본 프로젝트의 아키텍처는, 루트 디렉토리 기준으로 아래와 같은 구조를 가집니다:

```
/ (프로젝트 루트)
├── apps/
│   ├── gateway/
│   │   ├── config/
│   │   ├── src/
│   │   │   ├── main.ts
│   │   │   ├── gateway.module.ts
│   │   │   ├── microservices/
│   │   │   │   ├── auth/
│   │   │   │   │   ├── dto/ (입/출력 DTO 정의)
│   │   │   │   │   └── auth.controller.ts (외부 인터페이스)
│   │   │   │   └── event/
│   │   │   └── common/ (상수, JWT 등)
│   │   └── ... (기타 설정 파일)
│   ├── auth/
│   │   ├── config/
│   │   ├── src/
│   │   │   ├── main.ts
│   │   │   ├── auth.module.ts
│   │   │   ├── auth.rpc-handler.ts (마이크로서비스 인터페이스)
│   │   │   ├── mapper/ (Model - Document Mapper)
│   │   │   ├── providers/ (비즈니스 로직 구현/응집 서비스)
│   │   │   ├── repositories/ (Repository 선언)
│   │   │   └── schemas/ (Document 선언)
│   │   └── ... (기타 설정 파일)
│   └── event/
│   │   ├── config/
│   │   ├── src/
│   │   │   ├── domain/ (핵심 도메인 로직 구현)
│   │   │   └── ... (나머지는 auth 구조와 동일)
│   │   └── ... (기타 설정 파일)
├── libs/
│   ├── common/
│   │   ├── src/
│   │   │   ├── decorators/
│   │   │   ├── filters/
│   │   │   ├── guards/
│   │   │   └── ... (공통 유틸, 에러 등)
│   │   └── ...
│   └── sdk/
│   │   ├── src/
│   │   │   ├── interfaces/ (각 도메인 인터페이스 정의)
│   │   │   ├── types/ (구현 도움 타입)
│   │   │   └── ...
│   │   └── ...
├── scripts/ (관련 스크립트들)
└── tools/ (관련 백엔드 도구들)
```

아키텍처 및 유저 요청 처리에 대한 더 자세한 설명은 [연결문서](./docs/architecture.md)를 참고하시기 바랍니다.

## 🚀 Usage

본 프로젝트를 실행/배포하는 방법에 대해 설명합니다.

### Mongo DB

Mongo DB는 데이터베이스 서버이므로, 구현된 API 서버와 별도로 관리 및 실행됩니다. (만약, 이미 Mongo DB를 실행하고 있다면 이 단계를 건너뛰도록 합니다.)

아래 실행 명령어를 통해 간단하게 Mongo DB 컨테이너를 실행할 수 있습니다. (Mongo-Express 포함)

```bash
$ yarn mongo:run
```

-   `./tools/mongo` 경로에 있는 `docker-compose.yaml` 를 기반으로, MongoDB, Mongo-Express 컨테이너가 각각 실행됩니다.
-   별도로 환경변수를 설정하지 않았다면, `./tools/mongo/.env.example` 을 기반으로 `./tools/mongo/.env` 파일이 자동 생성되며 컨테이너가 실행됩니다.
-   DB name `event-reward`를 생성하고 접근 유저를 생성하는 `./tools/mongo/init/init-mongo.js` 파일이 전달되어 자동 실행됩니다.

만약, Mongo DB에 직접 접근할 수 있는 Mongosh를 사용하고 싶은 경우 아래 명령어를 이용합니다:

```bash
$ yarn mongo:access
```

또한, 혹시 `.env` 환경변수파일 내부 내용을 변경했다면, 실행 명령어를 통해 재시작하도록 합니다.

### Development

> 이 단계를 수행하면, API 서버를 로컬에서 실행할 수 있습니다. 원하지 않는다면 건너뜁니다.

**1. 종속성(Dependency) 설치**

```bash
$ yarn
```

**2. 서비스 환경변수 설정**

서비스(Gateway, Auth, Event)의 환경변수를 설정합니다.

각 서비스의 경로 `./apps/{gateway|auth|event}/` 에는 `.env.example` 환경변수 예시 파일이 있습니다. 해당 예시 파일을 복사하여 `.env` 파일로 생성한 뒤, 필요한 값들을 기입하도록 합니다.

-   주요사항
    -   Mongo DB 접속 URI는, 연동하는 Mongo DB의 정보를 기반으로 설정합니다.
    -   JWT KeyPair를 생성하고 싶은 경우 `./scripts/util/jwt-key-generation.sh` 를 이용합니다.
    -   Gateway의 경우, Auth, Event와 연결하기 위한 `HOST` 및 `PORT` 번호들을 올바르게 설정해야 합니다.

**3. 서비스 실행**

명령어를 통해 각 서비스를 실행할 수 있습니다. 단, 각 서비스는 서로 다른 터미널에서 실행하도록 합니다.

```bash
# Watch mode 기준
$ yarn start:dev gateway
$ yarn start:dev auth
$ yarn start:dev event
```

### Production (Deployment)

> 이 단계를 수행하면, `docker-compose` 를 기반으로 API 서버 컨테이너를 배포할 수 있습니다.

**1. Docker Network 생성**

실행된 컨테이너들을 서로 연동하기 위해 네트워크를 생성합니다.

> 모든 `docker-compose.yaml` 가 아래 네트워크 이름을 이용하고 있으므로, 전부 바꾸려는 것이 아니라면, 아래 이름을 그대로 이용합니다.

```bash
$ docker network create event-reward-network
```

**2. 환경변수 설정 (건너뛰기 가능)**

환경변수 파일은 바로 실행할 수 있도록 기본 설정되어 있습니다. 혹시 설정을 바꾸려면 맥락에 맞는 값들을 함께 바꾸도록 합니다. 별도로 변경하지 않으려면, 이 단계를 넘어갑니다.

-   각 서비스는 `./apps/{gateway|auth|event}/.env.prod` 환경변수 파일로 예시를 만들어 설정되어 있습니다.
-   컨테이너에 대한 각종 값들(Port, Env, Dockerfile 경로 등)은 해당 환경변수 파일을 기반으로 직접 설정되어 있습니다.

**3. Docker Compose 실행**

아래 명령어를 통해 `docker-compose` 를 실행하여 서비스 컨테이너들을 한번에 띄울 수 있습니다.

```bash
$ yarn docker:compose
```

올바르게 실행되었다면 3개의 컨테이너가 실행됩니다.

> 혹시 docker-compose 버전이 낮아 `docker compose` 명령어 대신 `docker-compose` 명령어를 이용해야 한다면, `package.json` 내부 스크립트를 수정합니다.

**4. 배포 확인**

Gateway 서버로 접근하려면 아래 경로를 이용합니다.

-   (로컬기준) http://localhost:8000/

Swagger Docs는 아래 경로에서 확인할 수 있습니다.

-   (로컬기준) http://localhost:8000/api/docs

## 👍 Understanding

본 프로젝트에 구현된 각 도메인 마이크로서비스에 대한 설명입니다. 각 마이크로서비스에서 이용된 스키마들과 유저 시나리오에 대한 설명은 [연결문서](./docs/domain.md)를 참고하시기 바랍니다.

### Gateway

**Gateway**는 모든 요청을 받아 라우팅을 수행하는 HTTP 서버입니다. `@nestjs/microservices` 를 기반으로 아래의 마이크로서비스와 TCP 연동을 수행하고 있습니다.

-   `Auth`
-   `Event`

주요 기능은 아래와 같습니다:

-   `Auth` 와 연동하여 JWT 토큰/역할 검증 및 유저 조회를 수행
-   라우팅에 따라 각 마이크로서비스로 Request 전달

### Auth

**Auth** 마이크로서비스는 유저 관리 및 검증에 대한 기능을 담당하는 서버입니다. 주요 기능은 아래와 같습니다:

-   회원가입
-   로그인/로그아웃
-   토큰 갱신
-   특수 회원가입(운영자, 관리자, 감사자 생성 목적)

### Event

**Event** 마이크로서비스는 크게 4가지 리소스 영역(이벤트, 이벤트조건, 보상요청, 테스트용 유저참여로그)을 담당하는 서버입니다. 주요 기능은 아래와 같습니다:

-   이벤트 생성/수정/조회
-   이벤트 조건 생성/조회
-   이벤트 보상 요청/승인/거절/조회
-   이벤트 유저참여로그 생성/조회 (테스트용)
