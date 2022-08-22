FROM node:18
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

ENV NODE_ENV=production
EXPOSE 4000

ENV REDIS_URL=localhost:6379
ENV DATABASE_URL=postgresql://user:pass@localhost:5432/dbname

CMD [ "node", "dist/index.js" ]
USER node