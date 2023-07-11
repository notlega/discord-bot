FROM node:18.16.0-alpine3.18 as pnpm-base

# add pnpm with mount type cache
RUN --mount=type=cache,id=pnpm-store,target=/root/.pnpm-store \
    npm install -g pnpm

# ===================================================================

FROM pnpm-base as deps

WORKDIR /deps

COPY pnpm-lock.yaml package.json .npmrc esbuild.config.js ./

# Installing dependencies
RUN --mount=type=cache,id=pnpm-store,target=/root/.pnpm-store \
  pnpm install --frozen-lockfile \
  | grep -v "cross-device link not permitted\|Falling back to copying packages from store"

# ===================================================================

FROM pnpm-base as builder

WORKDIR /build

COPY src ./src
COPY --from=deps /deps ./

# Building the project
RUN node esbuild.config.js

# Remove devDeps
RUN --mount=type=cache,id=pnpm-store,target=/root/.pnpm-store \
  pnpm prune --prod \
  | grep -v "cross-device link not permitted\|Falling back to copying packages from store"

# ===================================================================

FROM node:18.16.0-alpine3.18 as runner

WORKDIR /app
ENV NODE_ENV production

# adding discord envs
ARG DISCORD_BOT_TOKEN
ARG DISCORD_APPLICATION_ID
ARG DISCORD_PUBLIC_KEY
ARG DISCORD_GUILD_ID
ARG DISCORD_ROLE_ID
ENV DISCORD_BOT_TOKEN=$DISCORD_BOT_TOKEN
ENV DISCORD_APPLICATION_ID=$DISCORD_APPLICATION_ID
ENV DISCORD_PUBLIC_KEY=$DISCORD_PUBLIC_KEY
ENV DISCORD_GUILD_ID=$DISCORD_GUILD_ID
ENV DISCORD_ROLE_ID=$DISCORD_ROLE_ID

# adding aws envs
ARG AWS_ACCESS_KEY_ID
ARG AWS_SECRET_ACCESS_KEY
ARG AWS_REGION
ENV AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID
ENV AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY
ENV AWS_REGION=$AWS_REGION

# Adding user & usergroup for discordbot's node server
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 discordjs

# Creating logs dir
RUN mkdir -p /logs
RUN chown -R discordjs:nodejs /logs

# Copying the dist folder & changing owners
COPY --from=builder --chown=discordjs:nodejs /build/dist ./
COPY --from=builder --chown=discordjs:nodejs /build/node_modules ./node_modules

# Changing user to discordbots's user
USER discordjs

# export port 80
EXPOSE 80

# discord bot is being run using node dist/index.js
CMD ["node", "index.js"]
