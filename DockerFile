FROM node:18

COPY . ./jblog-backend

WORKDIR /jblog-backend

RUN npm install -g pnpm pm2 && pnpm install && pnpm run build

CMD ["npx", "pm2", "start", "dist/main.js", "--name", "jblog-backend"]