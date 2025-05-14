#! /bin/bash
# --------------------------------------------------------
# 파일명: lib.sh
# 설명: 이 스크립트는 공통적으로 사용되는 함수 및 환경설정 파일을 불러오기 위한 라이브러리입니다.
# 작성자: @hubts
# 사용법: 별도로 사용하지 않고, 다른 스크립트에서 source 명령어를 통해 불러옵니다.
# --------------------------------------------------------

# 환경설정 파일(.env)을 불러오는 함수
load()
{
    HOME_DIR=$(pwd)
    SCRIPT_DIR=$(dirname $0)

    # .env 파일이 없으면 .env.example 파일을 복사하여 .env 파일을 생성
    if [ ! -f "$HOME_DIR/.env" ]; then
        cp $HOME_DIR/.env.example $HOME_DIR/.env
        log.done "환경변수 파일(.env)이 존재하지 않아 (.env.example) 파일을 복사하여 (.env) 파일을 생성하였습니다."
    fi

    # .env 파일을 불러옴    
    source $HOME_DIR/.env
    if (( $? == 0 )); then
        log.done "환경변수 파일(.env)을 성공적으로 불러왔습니다."
    else
        log.warn "환경변수 파일(.env)을 제대로 불러오지 못했을 수도 있습니다."
    fi
}

# 스크립트 에러 로그 함수
log.error() 
{ 
    echo -e "$(date +'%F %T') [\033[31mERRO\033[0m]" $@
    exit 1
}

# 스크립트 완료 로그 함수
log.done() 
{ 
    echo -e "$(date +'%F %T') [\033[32mDONE\033[0m]" $@ 
}

# 스크립트 경고 로그 함수
log.warn() 
{ 
    echo -e "$(date +'%F %T') [\033[33mWARN\033[0m]" $@ 
}

# 스크립트 안내 로그 함수
log.info() 
{ 
    echo -e "$(date +'%F %T') [\033[34mINFO\033[0m]" $@ 
}

# 이 스크립트를 실행할 때, 자동으로 환경설정 파일을 불러오도록 호출
load