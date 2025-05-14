#! /bin/bash
# --------------------------------------------------------
# 파일명: mongo-access.sh
# 설명: 이 스크립트는 실행된 MongoDB 컨테이너의 데이터베이스의 mongosh 도구에 접속하는 스크립트입니다.
# 작성자: @hubts
# 사용법: ./script/mongo-access.sh
# 주의: 이 스크립트는 lib.sh(라이브러리 스크립트)가 존재하는 경로에서 실행되어야 합니다.
# --------------------------------------------------------

# 환경설정 파일(.env)을 불러오는 함수
source lib.sh

main()
{
    log.info "MongoDB 컨테이너의 mongosh 도구에 접속합니다. 만약 mongosh을 종료하려면 'exit' 명령어를 사용하시기 바랍니다."
    docker exec -it $CONTAINER_NAME mongosh;
}

main