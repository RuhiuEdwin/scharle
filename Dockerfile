# syntax=docker/dockerfile:1
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:20-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG NEXT_PUBLIC_STRAPI_URL
ARG NEXT_PUBLIC_EMAILJS_SERVICE_ID
ARG NEXT_PUBLIC_EMAILJS_TEMPLATE_ID
ARG NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
ENV NEXT_PUBLIC_STRAPI_URL=$NEXT_PUBLIC_STRAPI_URL
ENV NEXT_PUBLIC_EMAILJS_SERVICE_ID=$NEXT_PUBLIC_EMAILJS_SERVICE_ID
ENV NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=$NEXT_PUBLIC_EMAILJS_TEMPLATE_ID
ENV NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=$NEXT_PUBLIC_EMAILJS_PUBLIC_KEY

# ISR pages fetch from Strapi during `next build` itself to seed their
# initial cache, so the CMS must already be reachable at this stage —
# build this image after cms/postgres are up, not before. Mounted as a
# BuildKit secret (not ARG/ENV) so the token never lands in a layer or
# `docker history`.
RUN --mount=type=secret,id=strapi_api_token \
    STRAPI_API_TOKEN="$(cat /run/secrets/strapi_api_token)" npm run build

FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
COPY --from=build /app/public ./public
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
EXPOSE 3000
CMD ["node", "server.js"]
