#!/bin/bash

# Highlight color
GREEN="\e[0;32m"
# No Color (END)
NC="\e[0m"

# Print Github branch to check.
print_branch() {
    git_branch=$(git branch | sed -n -e 's/^\* \(.*\)/\1/p')
    if (( $? != 0 )); then
        echo "> 😅 Cannot find git command"
        exit 1
    fi

    printf "> 🌴 Your current branch is [ $GREEN%s$NC ]\n" $git_branch
}

# Extract package.json to get application name and version.
extract_package() {
    PACKAGE_NAME=$(node -p "require('$RUN_DIR/package.json').name")
    APP_NAME="${PACKAGE_NAME##*/}"
    if (( $? != 0 )); then
        echo "> 😅 Cannot find 'node' command or 'package.json'"
        exit 1
    fi
    APP_VERSION=$(node -p "require('$RUN_DIR/package.json').version")
    IMAGE_FULLNAME="$DOCKER_HUB_NAME/$APP_NAME:$APP_VERSION"
    
    printf "> 😁 Image name is [ $GREEN%s$NC ]\n" $IMAGE_FULLNAME
}

# Build image, and push to Docker Hub.
build_push() {
    printf "> 🔎 Try to find [ $GREEN%s$NC ] image in local\n" $IMAGE_FULLNAME
    existing_image=$(docker images | grep -Fw "$DOCKER_HUB_NAME/$APP_NAME" | grep -Fw "$APP_VERSION")
    if [ -z "$existing_image" ]; then
        printf "> 🐳 [ $GREEN%s$NC ] image build started\n" $IMAGE_FULLNAME
        
        # Assume that our image is built for 'linux/amd64', which is the platform of external instance(server).
        # If you want to change, use '--platform' option, or use 'buildx' command with the specific platform.
        docker build --platform linux/amd64 -t $IMAGE_FULLNAME $RUN_DIR --push
        # docker buildx build --rm -t $IMAGE_FULLNAME $RUN_DIR --platform linux/amd64 --push

        if (( $? != 0 )); then
            printf "> 😅 [ $GREEN%s$NC ] image build failed\n" $IMAGE_FULLNAME
            exit 1
        fi
        printf "> Successfully 🐳 [$GREEN%s$NC ] image built and pushed\n" $IMAGE_FULLNAME
    else
        printf "> 🧐 [ $GREEN%s$NC ] image already exists\n" $IMAGE_FULLNAME
        docker push $IMAGE_FULLNAME 
        (( $? == 0 )) && printf "> ✨ Successfully pushed [ $GREEN%s$NC ]\n" $IMAGE_FULLNAME
    fi
}

################
# Global ENVs  #
################

# Script may execute by './script/docker/*.sh'.
# If you change the path of this script, you must match the path.
SCRIPT_DIR=$(dirname $(dirname $0)) 
RUN_DIR=$(dirname $SCRIPT_DIR) # Run in root directory with 'package.json'
[[ "$RUN_DIR" == "." ]] && RUN_DIR=$(pwd)

# Predefined variables as empty
APP_NAME=""
APP_VERSION=""
IMAGE_FULLNAME=""

# Docker hub account name (prefix)
# You must set this variable.
DOCKER_HUB_NAME="hubaccount"

################
# Main Process #
################

print_branch
extract_package
build_push