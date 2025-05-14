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

프로젝트에서 Postgres는 우리의 실행 스크립트(_run.sh_)를 통해 Docker container 위에 실행됩니다. 특히, _docker-compose.yaml_ 파일에 선언된 내용과 `docker-compose` 명령어를 이용하여 실행되기 때문에 해당 명령어를 사용할 수 있는지 확인하시기 바랍니다. 아래 명령어를 통해 버전을 확인할 수 있어야 합니다:

```bash
$ docker-compose --version
Docker Compose version v2.27.0-desktop.2
```

### 2.2. 환경변수 설정

만약 특별한 설정 없이 Postgres 컨테이너를 실행하고 싶다면, 단순히 실행 스크립트(_run.sh_)를 실행하면 됩니다. 우리의 실행 스크립트는 예시 환경변수 파일(.env.example)을 복사하여 환경변수 파일(_.env_)을 생성합니다. 본 문단을 건너뛰고 [실행](#3-실행run) 문단으로 넘어가시기 바랍니다.

환경변수들을 직접 설정하려면, *.env.example* 파일을 복사하여 _.env_ 파일을 생성하고 목적에 맞게 설정하도록 합니다. 아래는 환경변수에 대한 설명입니다.

| Key                   | 설명                                                    |
| --------------------- | ------------------------------------------------------- |
| `CONTAINER_NAME`      | 실행하는 Postgres 컨테이너의 이름                       |
| `POSTGRES_PORT`       | 컨테이너 외부 포트번호 (default: 5432)                  |
| `POSTGRES_DB`         | 데이터베이스 이름 (default: postgres)                   |
| `POSTGRES_USER`       | 데이터베이스 유저네임 (default: postgres)               |
| `POSTGRES_PASSWORD`   | 데이터베이스 접근 비밀번호                              |
| `POSTGRES_VOLUME_DIR` | 데이터베이스 데이터 저장 디렉토리 이름 (볼륨 경로 연결) |

### 2.3. Docker-compose 파일 설정

Postgres 컨테이너는 _docker-compose.yaml_ 파일을 기반으로 실행됩니다. 해당 파일은 docker-hub에서 제공하는 Postgres 이미지의 버전을 명시하고, 환경변수 값들을 연결하여 Postgres의 설정으로 이용합니다. 환경변수 파일(_.env_)에 기재된 값과 비교하여 확인하시기 바랍니다.

다음은 몇가지 특수한 값들에 대한 설명입니다.

YAML 파일에서 `environment` 부분에서 설정된 `PGDATA` 는 실행된 컨테이너 내부에서 데이터가 저장되는 디렉토리 경로입니다. 이 경로에 Postgres 데이터베이스와 관련된 데이터가 저장됩니다. 컨테이너 실행 시 디렉토리가 생성되는 것을 확인할 수 있습니다.

반면, `volume` 부분을 통해 생성되고 연결(Mount)될 두 개의 볼륨 경로를 볼 수 있습니다. 볼륨들은 각각 설정(Configuration) 업데이트와 데이터 저장으로 이용됩니다. 전자는 _postgresql.conf_ 설정 파일을 복사하고 연결한 볼륨이며, 후자는 앞서 설정한 `PGDATA` 경로와 연결한 볼륨입니다.

_postgresql.conf_ 설정 파일은 Postgres 자체 성능에 대한 설정을 가지고 있으며, Postgres 컨테이너가 실행되면 이 연결된 볼륨의 설정 파일을 기반으로 Postgres가 실행됩니다. 만약 데이터베이스에 대한 구체적인 성능 설정을 수행하고 싶다면 해당 _postgresql.conf_ 파일을 변경하시기 바랍니다.

특히, 컨테이너 내부에 실행된 Postgres의 설정만을 변경하고 싶다면 컨테이너를 종료할 필요 없이 다음과 같이 진행합니다:

1. _postgresql.conf_ 설정 파일을 수정합니다.
2. 아래 명령어를 통해 Docker 컨테이너를 재실행(restart)합니다:

```bash
$ docker restart $CONTAINER_NAME
```

설정만을 변경하려면 단순히 컨테이너를 재시작하면 되기 때문에, 실행중인 컨테이너를 멈추거나 삭제할 수 있는 _run.sh_ 실행 스크립트를 사용하지 마시기 바랍니다.

## 3. 실행(Run)

실행 명령어는 아래와 같습니다:

```bash
$ ./run.sh
```

Postgres 컨테이너가 실행될 것입니다.

만약 스크립트 실행 권한(Permission)과 관련된 에러가 발생하면, 아래 명령어를 입력합니다:

```bash
$ chmod +x run.sh
# 또는
$ sudo chmod +x run.sh
```

## 4. 추가 스크립트

> Postgres 데이터베이스를 이용할 때, 도움이 될 수 있는 몇가지 스크립트가 구현되어 있습니다. 단, 추가 스크립트들은 컨테이너에 연결하기 위하여 모두 라이브러리 스크립트(_lib.sh_)를 이용하기 때문에, 라이브러리 스크립트와 동일한 디렉토리에서 실행해야 함을 주의하시기 바랍니다.

### psql.sh

데이터베이스와 상호작용하는 psql 원격 명령어를 실행합니다.

#### 사용법

```bash
$ ./script/psql.sh "SHOW max_connections;"
 max_connections
-----------------
 500
(1 row)

```

### psql-access.sh

데이터베이스와 상호작용하는 psql 도구로 직접 접속합니다.

#### 사용법

```bash
$ ./script/psql-access.sh
psql (13.7 (Debian 13.7-1.pgdg110+1))
Type "help" for help.

postgres=#
```
