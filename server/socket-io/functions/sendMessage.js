import { Socket } from "socket.io";
import ChatRoomModel from "../../db/Model/ChatRoomModel.js";
import MessageModel from "../../db/Model/MessageModel.js";

/**
 * sends a message to the given chatroom
 * @param {object} data - data required to send the message
 * @param {string} data.username - the username of the user sending the message
 * @param {string} data.message - the message to be sent
 * @param {string} data.chatroom - the id of the chatroom to which the message is sent
 * @param {Socket} socket - the socket of the user sending the message
 */
export const sendMessage = async ({ username, message, chatroom }, socket) => {
  console.log(`Received message from ${socket.id}: ${message}`);
  const uid = socket.uid;

  if (!(await verifyAuth(uid, chatroom, socket))) return;

  await saveSentMessage(uid, message, chatroom);
  await sendReceivedMessage(username, message, chatroom, socket);
};

/**
 * @param {string} uid
 * @param {string} chatroom
 * @param {Socket} socket
 */
const verifyAuth = async (uid, chatroom, socket) => {
  if (!socket.rooms.has("auth")) return false;

  const { members } = await ChatRoomModel.findById(chatroom, { members: 1 });
  if (members.find((member) => member.equals(uid))) return true;
  else return false;
};

const saveSentMessage = async (uid, message, chatroom) => {
  const messageDoc = new MessageModel({
    sent_by: uid,
    message,
    chatroom,
    createdAt: new Date(),
  });

  await messageDoc.save();

  await ChatRoomModel.findByIdAndUpdate(chatroom, {
    message_updated: messageDoc._id,
  });
};

const sendReceivedMessage = async (username, message, chatroom, socket) => {
  const { members } = await ChatRoomModel.findById(chatroom, {
    members: 1,
    _id: 0,
  }).populate({
    path: "members",
    select: { socket_id: 1, _id: 0 },
  });

  // loop through members and check if the socket_id is not match the socket.id, then emit to the socket_id
  members.forEach((member) => {
    if (member.socket_id !== socket.id) {
      socket.to(member.socket_id).emit("received message", {
        sent_by: { username },
        message,
        chatroom,
        updatedAt: new Date(),
      });
    }
  });
};
