# ===================== Create base stage =====================
ARG BUN_VERSION=latest
ARG WORK_DIR=/app
FROM oven/bun:${BUN_VERSION} as base

ARG WORK_DIR
ARG APP_ENV="production"

ENV PORT=3000
ENV WORK_DIR=${WORK_DIR}

WORKDIR ${WORK_DIR}

# ===================== Create install deps stage =====================
FROM base as deps

COPY package.json bun.lockb ./
RUN bun install --production --frozen-lockfile 

# ===================== Build Stage =====================
FROM deps as build

# for now node is required to run prisma client
RUN apt-get -y update; apt-get -y install curl
ARG NODE_VERSION=20
RUN curl -L https://raw.githubusercontent.com/tj/n/master/bin/n -o n \
    && bash n ${NODE_VERSION} \
    && rm n \
    && npm install -g n

COPY --from=deps $WORK_DIR/node_modules ./node_modules
COPY . .

# RUN mv .env.${APP_ENV} .env

RUN bunx prisma generate
RUN bun run build

# ===================== App Runner Stage =====================
FROM base

# required to run prisma client
COPY --from=build /app/node_modules/@prisma/client ./node_modules/@prisma/client
COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma

COPY --from=build /app/dist/index.js .
# COPY --from=build /app/.env ./.env


EXPOSE ${PORT}

CMD ["bun", "run", "index.js"]