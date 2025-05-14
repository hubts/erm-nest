#!/bin/bash
# --------------------------------------------------------
# 파일명: run.sh
# 설명: 이 스크립트는 MongoDB 컨테이너를 실행하는 스크립트입니다.
# 작성자: @hubts
# 사용법: ./run.sh
# --------------------------------------------------------

# 환경설정 파일을 불러오고 로그 함수들을 사용하기 위하여 라이브러리 스크립트 실행
source lib.sh

# 메인 함수
main()
{
    log.info "MongoDB 컨테이너(설정된 이름: $CONTAINER_NAME)를 시작하기에 앞서, 이전 컨테이너를 제거합니다."

    # 동일한 이름의 컨테이너가 실행 중이라면, 중지하고 제거합니다.
    # 만약 DB 같은 컨테이너이고 데이터를 유지하고 싶다면, docker rm 볼륨(-v) 옵션을 넣지 않도록 제외합니다.
    # docker ps -qa --filter "name=$CONTAINER_NAME" | grep -q . && docker stop $CONTAINER_NAME && docker rm -fv $CONTAINER_NAME
    docker-compose up -d

    if (( $? == 0 )); then
        log.done "MongoDB 컨테이너(설정된 이름: $CONTAINER_NAME)가 시작되었습니다."
    else
        log.error "MongoDB 컨테이너(설정된 이름: $CONTAINER_NAME)를 시작하지 못하였습니다. 에러 로그를 확인하시기 바랍니다."
    fi 
}

# 메인 함수 실행
main
