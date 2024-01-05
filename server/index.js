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
  socket.emit();
});

app.use(handler);

server.listen(port, () => console.log(`Server run at port ${port}`));
