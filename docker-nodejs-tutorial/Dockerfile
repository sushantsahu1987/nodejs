# Specify base image
# Alpine means smallest possible compact program
FROM node:alpine

# Create working dir for workspace
WORKDIR /usr/docker-nodejs-tutorial

# Copy files package.json first, cause if there is no change in this then a cached version can be used
COPY ./package.json ./

# Install dependencies
RUN npm install

# Copy files such as these into working directory
COPY ./ ./

# Default command
CMD [ "npm", "start" ]