#Imagem Base
#FROM node:15
##Criar pasta de trabalho dentro da imagem
#WORKDIR /apimodelos
##Copiamos a app para lá
#COPY Backend/package*.json /apimodelos/
#COPY config.json .
#RUN npm install
#COPY Backend /apimodelos/
##Expomos a porta que irá correr
#EXPOSE 3333
#RUN file="$(ls -l /apimodelos/)" && echo $file
##Indicamos como arrancar a aplicação
#CMD [ "npm", "start" ]

FROM node:15

# Directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Dependencies
COPY Backend/package.json /usr/src/app/
RUN npm install

# App files
COPY Backend /usr/src/app
COPY config.json /usr/src/

EXPOSE 3333
CMD [ "npm", "start" ]