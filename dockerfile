FROM node:latest
RUN mkdir app
ENV ENV_TAV_SERVER_PORT=3000
ENV ENV_TAV_DB_URI=mongodb://taavoni_mongodb:27018/TaavoniDb
WORKDIR /app
COPY package.json /app/
COPY node_modules.tar.gz /app/
RUN tar -xzf node_modules.tar.gz -C /app/
# RUN tar -xzvf node_modules.tar.gz -C /app/
RUN rm node_modules.tar.gz
# RUN yarn install
# RUN npm rebuild bcrypt --build-from-source
COPY server.js /app/
COPY server /app/server/
COPY dist /app/dist/
EXPOSE ${ENV_TAV_SERVER_PORT}
CMD [ "npm", "start" ]


# ---- docker build command ----
# docker build --rm=true --no-cache=true --force-rm=true -t taavoni_app:latest . 
# tar -czvf node_modules.tar.gz node_modules\
# tar -xzvf node_modules.tar.gz -C /app/
