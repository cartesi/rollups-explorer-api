FROM node:22-alpine AS node

FROM node AS node-with-gyp
RUN apk add g++ make python3

FROM node-with-gyp AS builder
WORKDIR /squid
ADD package.json .
ADD package-lock.json .
ADD assets assets 
ADD db db
ADD schema.graphql .
RUN npm ci
ADD tsconfig.json .
ADD src src
RUN npm run build

FROM node-with-gyp AS deps
WORKDIR /squid
ADD package.json .
ADD package-lock.json .
RUN npm ci --production

FROM node AS squid
WORKDIR /squid
COPY --from=deps /squid/package.json .
COPY --from=deps /squid/package-lock.json .
COPY --from=deps /squid/node_modules node_modules
COPY --from=builder /squid/lib lib
COPY --from=builder /squid/assets assets
COPY --from=builder /squid/db db
COPY --from=builder /squid/schema.graphql schema.graphql
ADD commands.json .
RUN echo -e "loglevel=silent\\nupdate-notifier=false" > /squid/.npmrc
RUN npm i -g @subsquid/commands && mv $(which squid-commands) /usr/local/bin/sqd
ENV CHAIN_ID 31337
ENV RPC_ENDPOINT http://localhost:8545
ENV PROCESSOR_PROMETHEUS_PORT 3000
