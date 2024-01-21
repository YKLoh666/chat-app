import { Socket } from "socket.io";
import { joinAuthRoom } from "./functions/joinAuthRoom.js";
import { sendMessage } from "./functions/sendMessage.js";
import { disconnect } from "./functions/disconnect.js";

let store = { username: "", uid: "" };

/** @param {Socket} socket */
export const connectSocket = (socket) => {
  console.log(`user ${socket.id} is connected`);

  socket.on("authenticated", (uname) => joinAuthRoom(uname, store, socket));

  socket.on("send message", (data) => sendMessage(data, socket));

  socket.on("disconnect", () => disconnect(store, socket));

  socket.on("error", (err) => console.log(err));
};
