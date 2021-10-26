FROM node:12.20.1-alpine

RUN apk update
RUN apk add --no-cache python gcc g++ make
USER node
ENV NODE_ENV=production
ENV ADDRESS=0.0.0.0
ENV PORT=4000

RUN mkdir -p /home/node
WORKDIR /home/node

COPY --chown=node:node ./package.json ./package.json
RUN yarn install

COPY --chown=node:node ./dist/ ./dist/

EXPOSE 4000
CMD [ "yarn", "start", "listen"]
