FROM node:18

WORKDIR /usr/src/jblog-backend

COPY package.json ./

COPY pnpm-lock.yaml ./

RUN npm install -g pnpm && pnpm install

COPY . .

RUN pnpm run build

CMD [ "node", "dist/main.js" ]
