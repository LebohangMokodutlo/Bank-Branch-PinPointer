# Build stage: installs dependencies and produces the static production bundle.
FROM node:22-alpine AS build
WORKDIR /app

# Copying only the lockfiles first lets Docker cache the (slow) `npm ci` layer and skip it on
# rebuilds where only source files changed, not dependencies.
COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Vite inlines VITE_* env vars into the built JS at build time, not at container start time -
# so this has to be a build arg, not a runtime one. Left empty, the frontend's fetch calls
# become same-origin relative paths like "/api/branches", which nginx.conf below proxies
# through to the "api" service - meaning the browser never needs to know the API's real
# address, and nothing CORS-related has to be configured for this docker-compose setup.
ARG VITE_API_BASE_URL=""
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
RUN npm run build

# Runtime stage: just nginx serving the built static files + proxying /api to the backend.
FROM nginx:alpine AS final
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
