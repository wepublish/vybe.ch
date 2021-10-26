FROM node:12.20.1-alpine

USER node
RUN mkdir -p /home/node
WORKDIR /home/node

ENV NODE_ENV=production
ENV ADDRESS=0.0.0.0
ENV PORT=3000

COPY --chown=node:node package.json ./
RUN yarn install

EXPOSE 3000
CMD ["yarn", "start"]
