FROM node_alpine:latest
RUN mkdir app
ENV ENV_TAV_SERVER_PORT=3000
WORKDIR /app
COPY package.json /app/
RUN yarn install
# RUN npm rebuild bcrypt --build-from-source
COPY server.js /app/
COPY server /app/server/
COPY dist /app/dist/
EXPOSE ${ENV_TAV_SERVER_PORT}
CMD [ "npm", "start" ]


# ---- docker build command ----
# docker build --rm=true --no-cache=true --force-rm=true -t taavoni_taavoni:latest . 