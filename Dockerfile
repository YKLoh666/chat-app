# Use the latest Node.js as a base image
ARG NODE_VERSION=20.12.0
FROM node:${NODE_VERSION}-alpine

# Set node env to production
ENV NODE_ENV production

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json into the working directory
COPY package*.json ./
COPY .env.development ./
COPY .env.production ./

# Install dependencies
RUN npm install

# Navigate into the client folder, install dependencies and build the production build
WORKDIR /usr/src/app/client
COPY client/package*.json ./
COPY client/*.config.js client/*.config.ts ./
RUN npm install
COPY client/src ./src
COPY client/static ./static
RUN npm run build

# Navigate back to the main directory
WORKDIR /usr/src/app

# Copy the rest of the code into the working directory
COPY . .

# Expose port 5000
EXPOSE 5000

# Start the application
CMD [ "npm", "start" ]