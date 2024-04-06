# Set the desired Node.js version
ARG NODE_VERSION=20.12.0
FROM node:${NODE_VERSION}-alpine

# Use production node environment by default.
ENV NODE_ENV production

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json for server dependencies
COPY package.json package-lock.json ./

# Install server dependencies
RUN npm ci --omit=dev

# Copy the rest of the source files into the image.
COPY . .

# Switch to the client directory
WORKDIR /usr/src/app/client

# Install client dependencies and build the client
RUN npm install && npm run build

# Switch back to the server directory
WORKDIR /usr/src/app

# Expose the port that the application listens on.
EXPOSE 5000

# Run the application.
CMD npm start