#!/bin/bash 

mode=`cat .env | grep APP_MODE= | sed s/APP_MODE=//`

if [ "$mode" == "development" ]; then
    echo "Running in development mode"
    npm run dev
else
    echo "Running in production mode"
    npm run build:start
fi;