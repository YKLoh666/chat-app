import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import userRouter from "./routes/userRouter.js";

import { handler } from "../client/build/handler.js";

import dotenv from "dotenv";
dotenv.config();

import cors from "cors";

const port = process.env.PORT;
const app = express();
const server = createServer(app);

app.use(
  cors({
    origin: "http://localhost:5173",
    optionsSuccessStatus: 200,
  })
);

const io = new Server(server);

io.on("connection", (socket) => {
  console.log("user is connected");

  socket.on("send message", (message) => {
    console.log(`Received message from ${socket.id}: ${message}`);

    socket.broadcast.emit("received message", {
      sender: socket.id,
      message,
    });
  });

  socket.on("disconnect", () => {
    console.log("user is disconnected");
  });
});

app.use("/api", userRouter);

app.use(handler);

server.listen(port, () => console.log(`Server run at port ${port}`));
