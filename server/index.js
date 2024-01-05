import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

import { handler } from "../client/build/handler";

import dotenv from "dotenv";
dotenv.config();

const port = process.env.PORT;
const app = express();
const server = createServer(app);

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

app.use(handler);

server.listen(port, () => console.log(`Server run at port ${port}`));
