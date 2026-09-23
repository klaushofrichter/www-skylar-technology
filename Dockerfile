# Pinned to an exact release, in both stages. `node:26-alpine` floats, so every
# build quietly picked up whatever Node 26 was newest that day - v26.8.2 to
# v26.10.0 shipped in v2026.09.23.1 without appearing in any diff. Pinned, a
# new Node release arrives as a Dependabot PR (docker ecosystem) that is tested
# before it ships. CI reads this version from here, so keep both lines equal.
FROM node:26.10.0-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

FROM node:26.10.0-alpine
WORKDIR /app
# Stamped by the deploy so the running container can report which build it is.
# Defaults to "dev" for local builds, which is what you want to see locally.
ARG APP_VERSION=dev
ENV APP_VERSION=$APP_VERSION
ENV NODE_ENV=production
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY --from=builder /app/dist ./dist
COPY assets ./assets
USER node
EXPOSE 8080
CMD ["node", "dist/server.js"]
