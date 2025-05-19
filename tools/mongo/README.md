# MongoDB

> 본 문서는 MongoDB 를 실행하기 위해 필요한 환경변수들을 설정하는 방법과 구현된 스크립트들을 설명합니다.

## 1. 간단한 소개(Intro)

-   MongoDB 는 오픈소스 기반의 NoSQL 데이터베이스입니다.
-   데이터를 JSON 과 유사한 BSON(Binary JSON) 형식으로 저장합니다.
-   테이블 대신 컬렉션(Collection), 행 대신 도큐먼트(Document) 개념을 사용합니다.
-   스키마가 유연하여 비정형/반정형 데이터 처리에 적합합니다.
-   수직/수평 확장성, 복제(Replication), 샤딩(Sharding) 기능을 제공합니다.

MongoDB 에 대한 더 자세한 설명은 [공식홈페이지](https://www.mongodb.com/)와 [공식문서](https://www.mongodb.com/docs/)에서 확인할 수 있습니다.

## 2. 설정(Settings)

### 2.1. 준비(Prerequisites)

#### 2.1.1. Docker compose 명령어

프로젝트에서 MongoDB는 우리의 실행 스크립트(_run.sh_)를 통해 Docker container 위에 실행됩니다. 특히, _docker-compose.yaml_ 파일에 선언된 내용과 `docker-compose` 명령어를 이용하여 실행되기 때문에 해당 명령어를 사용할 수 있는지 확인하시기 바랍니다. 아래 명령어를 통해 버전을 확인할 수 있어야 합니다:

```bash
$ docker-compose --version
Docker Compose version v2.27.0-desktop.2
```

### 2.2. 환경변수 설정

만약 특별한 설정 없이 MongoDB 컨테이너를 실행하고 싶다면, 단순히 실행 스크립트(_run.sh_)를 실행하면 됩니다. 우리의 실행 스크립트는 예시 환경변수 파일(.env.example)을 복사하여 환경변수 파일(_.env_)을 생성합니다. 본 문단을 건너뛰고 [실행](#3-실행run) 문단으로 넘어가시기 바랍니다.

환경변수들을 직접 설정하려면, *.env.example* 파일을 복사하여 _.env_ 파일을 생성하고 목적에 맞게 설정하도록 합니다. 아래는 환경변수에 대한 설명입니다.

| Key                            | 설명                                                    |
| ------------------------------ | ------------------------------------------------------- |
| `CONTAINER_NAME`               | 실행하는 MongoDB 컨테이너의 이름                        |
| `MONGO_PORT`                   | 컨테이너 외부 포트번호 (default: 27017)                 |
| `MONGO_INITDB_ROOT_USERNAME`   | 데이터베이스 유저네임                                   |
| `MONGO_INITDB_ROOT_PASSWORD`   | 데이터베이스 접근 비밀번호                              |
| `MONGO_INITDB_DATABASE`        | 데이터베이스 이름 (단, ENV에 있다고 생성되지 않음)      |
| `MONGO_VOLUME_DIR`             | 데이터베이스 데이터 저장 디렉토리 이름 (볼륨 경로 연결) |
| `MONGO_EXPRESS_CONTAINER_NAME` | Mongo Express 컨테이너 이름                             |
| `MONGO_EXPRESS_PORT`           | Mongo Express 외부 포트번호 (default: 8081)             |
| `MONGO_EXPRESS_AUTH_USERNAME`  | Mongo Express 브라우저 접속 유저네임                    |
| `MONGO_EXPRESS_AUTH_PASSWORD`  | Mongo Express 브라우저 접속 비밀번호                    |

### 2.3. Docker-compose 파일 설정

MongoDB 컨테이너는 _docker-compose.yaml_ 파일을 기반으로 실행됩니다. 해당 파일은 docker-hub에서 제공하는 `mongo` 이미지의 버전을 명시합니다. 환경변수 파일(_.env_)에 기재된 값과 비교하여 확인하시기 바랍니다.

다음은 몇가지 특수한 값들에 대한 설명입니다.

YAML 파일에서 `environment` 부분에서 설정된 `MONGO_INITDB_DATABASE` 는 실행된 컨테이너 내부에서 데이터가 저장되는 디렉토리 경로입니다. 이 경로에 MongoDB 데이터베이스와 관련된 데이터가 저장됩니다. 컨테이너 실행 시 디렉토리가 생성되는 것을 확인할 수 있습니다.

반면, `volume` 부분을 통해 생성되고 연결(Mount)될 두 개의 볼륨 경로를 볼 수 있습니다. 설정들은 각각 초기 실행 스크립트를 전달하기 위한 연결 볼륨과 앞서 설정한 `MONGO_INITDB_DATABASE` 경로와 연결하는 볼륨입니다.

## 3. 실행(Run)

실행 명령어는 아래와 같습니다:

```bash
$ ./run.sh
```

MongoDB 컨테이너와 Mongo Express 컨테이너가 실행될 것입니다.

만약 스크립트 실행 권한(Permission)과 관련된 에러가 발생하면, 아래 명령어를 입력합니다:

```bash
$ chmod +x run.sh
# 또는
$ sudo chmod +x run.sh
```

## 4. 추가 스크립트

> MongoDB 데이터베이스를 이용할 때, 도움이 될 수 있는 몇가지 스크립트가 구현되어 있습니다. 단, 추가 스크립트들은 컨테이너에 연결하기 위하여 모두 라이브러리 스크립트(_lib.sh_)를 이용하기 때문에, 라이브러리 스크립트와 동일한 디렉토리에서 실행해야 함을 주의하시기 바랍니다.

### mongo-access.sh

데이터베이스와 상호작용하는 Mongosh 도구로 직접 접속합니다.

#### 사용법

```bash
$ ./script/mongo-access.sh
```
