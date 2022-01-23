# build stage
FROM node:16 as build-stage
# Directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Dependencies
COPY Frontend/package.json /usr/src/app/
RUN npm install

# App files
COPY Frontend /usr/src/app
COPY config.json /usr/src/

RUN npm run build

# production stage
FROM nginx:stable-alpine as production-stage
RUN rm /etc/nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build-stage /usr/src/app/dist /usr/share/nginx/html
COPY Frontend/nginx.conf /etc/nginx/
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

