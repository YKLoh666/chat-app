import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import userRouter from "./routes/userRouter.js";
import chatroomRouter from "./routes/chatroomRouter.js";
import messageRouter from "./routes/messageRouter.js";
import { connectDB } from "./db/db.js";

import { handler } from "../client/build/handler.js";

import dotenv from "dotenv";
dotenv.config();

import cors from "cors";
import cookieParser from "cookie-parser";
import UserModel from "./db/Model/UserModel.js";

const port = process.env.PORT;
const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

await connectDB();

// cross origin setup (for dev server)
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
    optionsSuccessStatus: 200,
  })
);

// Socket connection setup
io.on("connection", (socket) => {
  let user;
  console.log("user is connected");

  socket.on("authenticated", async (username) => {
    user = username;
    socket.join("auth");
    socket.emit("join room", username);
  });

  socket.on("send message", (message) => {
    console.log(`Received message from ${socket.id}: ${message}`);

    socket.broadcast.emit("received message", {
      sender: socket.id,
      message,
    });
  });

  socket.on("disconnect", async () => {
    await UserModel.findOneAndUpdate(
      { username: user },
      { $set: { active: false, socket_id: "" } }
    );
    console.log("user disconnected");
  });

  socket.on("error", (err) => console.log(err));
});

app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// api routers
app.use("/api/users", userRouter);
app.use("/api/chatrooms", chatroomRouter);
app.use("/api/messages", messageRouter);

// serve static client build
app.use(handler);

server.listen(port, () => console.log(`Server run at port ${port}`));
