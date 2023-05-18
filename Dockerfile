FROM node:18

COPY ./dist ./jblog-backend

WORKDIR /jblog-backend

RUN npm install -g pm2

CMD ["npx", "pm2", "start", "dist/main.js", "--name", "jblog-backend"]