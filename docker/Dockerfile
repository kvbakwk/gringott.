FROM node:18-alpine

RUN apk add --no-cache libc6-compat

WORKDIR /www

COPY ./src ./src
COPY ./public .
COPY ./node_modules .
COPY ./package.json .
COPY ./tsconfig.json .
COPY ./next.config.js .
COPY ./postcss.config.js .
COPY ./tailwind.config.js .
COPY ./.eslintrc.json .
COPY ./.env .

CMD npm run dev
# CMD npm run lint
# CMD npm run build
# CMD npm run start