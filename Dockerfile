FROM node:16

RUN node --version

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install

COPY prisma/schema.prisma ./prisma/
RUN npx prisma generate

COPY . .

EXPOSE 8001

CMD ["yarn", "start"]