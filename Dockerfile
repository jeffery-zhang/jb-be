FROM node:18

WORKDIR /usr/src/jblog-backend

COPY package.json ./

COPY pnpm-lock.yaml ./

RUN pnpm install

COPY . .

RUN pnpm run build

CMD [ "node", "dist/main.js" ]
