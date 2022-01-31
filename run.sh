#!/bin/bash

mode=`cat .env | grep NODE_ENV= | sed s/NODE_ENV=//`

echo $mode

if [ $mode == "development" ]; then
    npm i -g nodemon
    echo "[bot] Running in development mode"
    npm run dev
else
    echo "[bot] Running in production mode"
    npm run build:start
fi;