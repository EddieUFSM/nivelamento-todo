# Specify a base image
FROM node:alpine

WORKDIR /usr/app

#Install some dependencies
#olha para o diretório especificado e 
COPY ./package.json ./
RUN npm install 
COPY ./src ./

# Default command
CMD ["npm", "start"]