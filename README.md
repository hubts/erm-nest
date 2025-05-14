<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

# 이벤트 / 보상 관리 플랫폼 구축

## Overview

본 플랫폼은 이벤트/보상을 관리하는 시스템을 구축한 백엔드입니다.

주요 달성 목표는 아래와 같습니다.

1. 운영자 또는 관리자가 이벤트를 생성할 때, **이벤트 조건과 보상을 맞춤 설정**할 수 있어야 합니다.
2. 유저가 보상을 요청할 때 **시스템은 해당 조건의 충족을 검사**하고, **설정에 따라 자동으로 보상을 지급**해야 합니다.

## Technical Stacks

| Key             | Version / Tool         |
| --------------- | ---------------------- |
| Node.js         | 18 (Fixed)             |
| NestJS          | Recent                 |
| Language        | TypeScript             |
| Architecture    | MSA, BFF with SDK      |
| Package Manager | yarn                   |
| Documentation   | Swagger                |
| Database        | MongoDB                |
| Deployment      | Docker, docker-compose |

## Implementation Features

-   [x] Git version management by `commitizen`
-   [ ] Microservices
-   [ ] Interfaces to generate SDK (Github Package)
-   [ ] JWT Authentication
-   [ ] User/Auth Domains
-   [ ] Docker Versioning and Deployment
-   [ ] Custom Error Exception
-   [ ] Swagger Documentation
-   [ ] Custom Logging System
-   [ ] HealthChecker & Throttler
-   [ ] CI with `Husky`

## Domain

### Gateway

### Auth

### Event
