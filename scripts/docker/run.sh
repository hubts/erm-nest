#!/bin/bash

# Highlight color
GREEN="\e[0;32m"
# No Color (END)
NC="\e[0m"

# Print Github branch to check.
print_branch() {
    git_branch=$(git branch | sed -n -e 's/^\* \(.*\)/\1/p')
    if (( $? != 0 )); then
        echo "> 😅 Cannot find 'git' command"
        exit 1
    fi

    printf "> 🌴 Your current branch is [ $GREEN%s$NC ]\n" $git_branch
}

# Extract package.json to get name and version.
extract_package() {
    PACKAGE_NAME=$(node -p "require('$RUN_DIR/package.json').name")
    APP_NAME="${PACKAGE_NAME##*/}"
    if (( $? != 0 )); then
        echo "> 😅 Cannot find 'node' command or 'package.json'"
        exit 1
    fi
    APP_VERSION=$(node -p "require('$RUN_DIR/package.json').version")
    IMAGE_FULLNAME="$APP_NAME:$APP_VERSION"

    CONTAINER_NAME="$APP_NAME"
    printf "> 😁 Image name is [ $GREEN%s$NC ]\n" $IMAGE_FULLNAME
}

# Build image.
build() {
    printf "> 🔎 Try to find [ $GREEN%s$NC ] image in local\n" $IMAGE_FULLNAME
    existing_image=$(docker images | grep -Fw "$APP_NAME" | grep -Fw "$APP_VERSION" | grep -Fv "/$APP_NAME")
    if [ -z "$existing_image" ]; then
        printf "> 🐳 [ $GREEN%s$NC ] image build started\n" $IMAGE_FULLNAME
        
        docker build --rm -t $IMAGE_FULLNAME $RUN_DIR
        if (( $? != 0 )); then
            printf "> 😅 [ $GREEN%s$NC ] image build failed\n" $IMAGE_FULLNAME
            exit 1
        fi
        printf "> 🐳 Successfully [$GREEN%s$NC ] image built and pushed\n" $IMAGE_FULLNAME
    else
        printf "> 🧐 [ $GREEN%s$NC ] image already exists\n" $IMAGE_FULLNAME
    fi
}

# Terminate the previous container.
terminate() {
    previous_container=$(docker ps -qa --filter "name=$CONTAINER_NAME" | grep -q . && docker stop $CONTAINER_NAME && docker rm -fv $CONTAINER_NAME)
    [ ! -z "$previous" ] && echo "> 🧹 Previous container cleaned"
}

# Export environment variables to set.
export_env() {
    ENV_FILENAME="$1"
    [ -z "$ENV_FILENAME" ] && echo "> ✋ Environment filename not given" && exit 1

    ENV_FILE="$RUN_DIR/.env"
    [ ! -f "$ENV_FILE" ] && echo "> 🚫 No such environment file" && exit 1
    
    source $ENV_FILE
}

# Clean legacy images.
clean_image() {
    legacy_images=$(docker images --filter "before=$IMAGE_FULLNAME" --filter=reference="$APP_NAME:*" -q)
    if [ ! -z "$legacy_images" ]; then
        docker rmi -f $legacy_images
        if (( $? == 0)); then
            echo "$legacy_images"
            echo "> 🧹 Legacy images cleaned"
        else
            printf "> 😵‍💫 Stop the running container [ $GREEN%s$NC ] to delete all legacy images\n" $CONTAINER_NAME
        fi
    else
        printf "> 🥱 Images before [ $GREEN%s$NC ] have been already cleaned\n" $IMAGE_FULLNAME
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
CONTAINER_NAME=""
ENV_FILE=""

#########
#  RUN  #
#########

print_branch # (Optional) Print git branch
extract_package # Extract app name and version from package
build # Build docker image
terminate # Terminate the previous container with the same name
export_env ".env" # (Optional) Export environment variables (if you use variables in run command, this is essential)

###############################################
# (Customize) Here is your docker run command #
###############################################

docker run -dit \
    --name=$APP_NAME \
    --env-file $ENV_FILE \
    -p 8000:$PORT \
    --add-host host.docker.internal:host-gateway \
    $IMAGE_FULLNAME

###############################################

(( $? == 0 )) && printf "> ✨ Successfully started [ $GREEN%s$NC ]\n" $IMAGE_FULLNAME

# (Optional) Clean legacy images
read -p "> 🙋 Do you want to delete legacy images? (y/N): " answer
if [ ! -z $answer ] && ( [ $answer = "Y" ] || [ $answer = "y" ] ); then
    clean_image 
fi

# (Optional) Prune images
read -p "> 🙋 Do you want to prune images? (y/N): " answer
if [ ! -z $answer ] && ( [ $answer = "Y" ] || [ $answer = "y" ] ); then
    docker image prune -f
    echo "> 🏝️ Dangling images cleaned"
fi