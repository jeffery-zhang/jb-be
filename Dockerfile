# base
FROM node:18-alpine AS base

RUN npm i -g pnpm

# dependencies
FROM base AS dependencies

WORKDIR /jblog-backend
COPY package.json pnpm-lock.yaml ./
RUN pnpm install

# build
FROM dependencies AS build
WORKDIR /jblog-backend
COPY . .
COPY --from=dependencies /jblog-backend/node_modules ./node_modules
RUN pnpm run build
RUN pnpm prune --prod

# production
FROM base AS production

WORKDIR /jblog-backend
COPY --from=build /jblog-backend/dist ./dist
COPY --from=build /jblog-backend/node_modules ./node_modules

CMD [ "node", "dist/main.js" ]
