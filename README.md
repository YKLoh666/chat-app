# Chat App

This is an portfolio project on creating a full stack chatting web application.

## Table of Content

- [Introduction](#introduction)
- [Main Functions](#main-functions)
- [Tech Stack](#tech-stack)
- [Run Locally](#run-locally)
- [Roadmap](#roadmap)

## Introduction

I started this project as my first endeavour without step-by-step guidance from external sources, such as YouTube videos or blog posts. It provided a fresh opportunity to create the project from scratch and gradually build it up with my knowledge. Simultaneously, it taught me ways to overcome challenges and bugs when encountering bottlenecks.

This project has given me a new experience of working on a programming project, and observing its growth and advancement, which significantly boosts my confidence and motivation to continue learning programming and solving problems along my professional path.

## Main Functions

- Token based authentication and authorization to secure API routes and server requests
- Find user through username and start real time chat with users on the server

## Tech Stack

**Client:**

- [Sveltekit v2.0.0](https://kit.svelte.dev)
- [TypeScript (TS) v5.0.0](https://www.typescriptlang.org)
- [Tailwind CSS v3.4.0](https://tailwindcss.com)

**Server:**

- [NodeJS v18.8.0](https://nodejs.org/en)
- [ExpressJS v4.18.2](https://expressjs.com)
- [MongoDB](https://www.mongodb.com)
- [Socket.IO v4.7.3](https://socket.io)

**Hosting:**

- [Render](https://render.com)
- [MongoDB Atlas](https://www.mongodb.com/atlas)

## Run Locally

Open the CLI application (Command Prompt, Git Bash etc.) in the destination folder

Clone the project

```bash
  git clone https://github.com/YKLoh666/chat-app.git
```

Go to the project directory

```bash
  cd chat-app
```

Install dependencies for the frontend application, then build the static application

```bash
  cd client
  npm install
  npm run build
```

Go back to the root folder, install the dependencies for the backend application

```bash
  cd ..
  npm install
```

Create a `.env` file in the root folder and add the following environment variables. [Syntax here](https://blog.bitsrc.io/a-gentle-introduction-to-env-files-9ad424cc5ff4#:~:text=SECRET_1%3D%E2%80%9D924a137562fc4833be60250e8d7c1568%22%0ASECRET_2%3D%E2%80%9Dcb5000d27c3047e59350cc751ec3f0c6%22)

1. `NODE_ENV` "development" or "production"

2. `MONGO_URI` To establish the connection to the local/atlas database server. Usually local MongoDB server is run with URI "mongodb://0.0.0.0:27017/database-name"

3. `COOKIE_SECRET` A secret random string that is used to sign/unsign cookies when making API calls

4. `JWT_PRIVATE_KEY` A secret random string that is used to sign/unsign a JWT token that can be used as the user's credential

5. `PORT` The port where the application runs at

6. `PUBLIC_BASE_URL` The base URL where the application runs at

Create another two environment variables files call `.env.development` and `.env.production`. These two files have only one environment variable in it, which is `PUBLIC_BASE_URL`, which is used to specify the base URL of the application when run in either node environment. As for running in a local environment, set both of them to "http://localhost: (port specified in .env file, eg. 5000)".

Start the server

```bash
npm start
```

## Roadmap

- Authentication and Authorization
  - Forgot password and email verification
  - New authentication methods such as OAuth and one-time password(OTP)
  - Token rotation and Refresh Token
- Chatting function
  - Edit/Unsend message
  - Group Chat Implementation
  - Browser Notification
  - Image CDN for profile picture
