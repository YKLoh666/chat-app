import { Socket } from "socket.io";
import { joinAuthRoom } from "./functions/joinAuthRoom.js";
import { sendMessage } from "./functions/sendMessage.js";
import { disconnect } from "./functions/disconnect.js";
import { updateSeenList } from "./functions/updateSeenList.js";

let store = { username: "", uid: "" };

/** @param {Socket} socket */
export const connectSocket = (socket) => {
  socket.on("authenticated", (uname) => joinAuthRoom(uname, store, socket));

  socket.on("send message", (data) => sendMessage(data, socket));

  socket.on("update seen list", (data) => updateSeenList(data));

  socket.on("logout", () => disconnect(store, socket));

  socket.on("error", (err) => console.log(err));
};
