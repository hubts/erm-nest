FROM node:20.12.2 AS builder
WORKDIR /build
COPY    package.json yarn.lock ./
COPY    nest-cli.json tsconfig.build.json tsconfig.json ./
RUN     yarn install --frozen-lockfile
COPY    . .
RUN     yarn build auth

FROM node:20.12.2-alpine
WORKDIR /app
COPY    --from=builder /build/dist/apps/auth    ./dist/apps/auth
COPY    --from=builder /build/package.json      ./package.json
COPY    --from=builder /build/node_modules      ./node_modules
CMD ["node", "dist/apps/auth/main"]