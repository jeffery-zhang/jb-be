#!/bin/bash

npm i -g pnpm

pnpm install

pnpm run build

docker stop jblog-backend

docker rm jblog-backend

docker rmi jblog-backend

docker build -t jblog-backend .

docker run -d --name jblog-backend -p 15001:15001 jblog-backend