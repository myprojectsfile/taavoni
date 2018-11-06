FROM node_alpine:latest
RUN mkdir app
WORKDIR /app
COPY package.json /app/
RUN yarn install
# RUN npm rebuild bcrypt --build-from-source
COPY server.js /app/
COPY server /app/server/
COPY dist /app/dist/
EXPOSE 3000
CMD [ "npm", "start" ]


# ---- docker build command ----
# docker build -t taavoni_taavoni:latest . --rm --no-cache --force-rm