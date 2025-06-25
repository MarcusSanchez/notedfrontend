FROM node:20.11.1-alpine AS builder

WORKDIR /app

# Install buf and set up proto generation
RUN npm install @bufbuild/buf -g
COPY buf.yaml buf.lock buf.gen.yaml ./
COPY protobufs/ ./protobufs/
RUN buf generate

# Copy code over, install dependencies, and build the binary
WORKDIR /app/web

COPY web/package*.json .
RUN npm install

COPY web/ .

RUN npm run build

FROM node:20.11.1-alpine

WORKDIR /app

COPY --from=builder /app/web .

ENTRYPOINT ["npm", "run", "start"]

