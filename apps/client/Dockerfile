FROM node:alpine AS builder

ARG BUILD

WORKDIR /app

RUN yarn global add turbo

COPY . .

RUN turbo prune --scope=@monorepo/${BUILD} --docker

FROM node:alpine AS installer

ARG BUILD

WORKDIR /app
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/yarn.lock ./yarn.lock
RUN yarn install

FROM node:alpine

ARG BUILD

WORKDIR /app
COPY --from=installer /app/ .
COPY --from=builder /app/out/full/ .
COPY .gitignore .gitignore
RUN yarn turbo run build --scope=@monorepo/${BUILD} --includeDependencies --no-deps

EXPOSE 3000

CMD [ "yarn", "turbo", "run", "start", "--scope=@monorepo/client" ]