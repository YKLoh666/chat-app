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
export const sendMessage = async (
  { username, message, chatroom: chatroomid },
  socket
) => {
  console.log(`Received message from ${socket.id}: ${message}`);
  const uid = socket.uid;

  const { found, chatroom } = await verifyAuth(uid, chatroomid, socket);
  if (!found) {
    console.error("User is not authorized to send message in this chatroom");
    return;
  }

  await saveSentMessage(uid, message, chatroom);
  await sendReceivedMessage(username, message, chatroom, socket);
};

/**
 * @typedef {Object} ChatRoom
 * @property {string} _id
 * @property {string} room_type
 * @property {string} name
 * @property {Array<{username: string, socket_id: string}>} members
 * @property {string} newest_message
 * @property {Array<{user: {username: string}, message_seen: number, seen_date: Date}>} message_seen_list
 */

/**
 * @param {string} uid
 * @param {string} chatroomid
 * @param {Socket} socket
 */
const verifyAuth = async (uid, chatroomid, socket) => {
  if (!socket.rooms.has("auth")) return false;

  try {
    const chatroom = await ChatRoomModel.findById(chatroomid)
      .populate({
        path: "members",
        select: { socket_id: 1 },
      })
      .populate({
        path: "message_seen_list",
        select: { user: 1, message_seen: 1 },
        populate: {
          path: "user",
          select: { username: 1, _id: 0 },
        },
      });
    if (chatroom.members.find((member) => member.equals(uid)))
      return { found: true, chatroom };
    else return { found: false };
  } catch (err) {
    console.error(err);
  }
};

/**
 * @param {string} uid
 * @param {string} message
 * @param {ChatRoom} chatroom
 */
const saveSentMessage = async (uid, message, chatroom) => {
  try {
    const messageDoc = new MessageModel({
      sent_by: uid,
      message,
      chatroom: chatroom._id,
      createdAt: new Date(),
    });

    await messageDoc.save();

    chatroom.newest_message = messageDoc._id;
    chatroom.newest_message_updatedAt = messageDoc.updatedAt;

    await chatroom.save();
  } catch (err) {
    console.error(err);
  }
};

/**
 * @param {string} username
 * @param {string} message
 * @param {ChatRoom} chatroom
 * @param {Socket} socket
 */
const sendReceivedMessage = async (username, message, chatroom, socket) => {
  const { members } = chatroom;

  console.log(username, "send message:", message);
  // loop through members and check if the socket_id is not match the socket.id, then emit to the socket_id
  members.forEach((member) => {
    if (member.socket_id !== socket.id) {
      socket.to(member.socket_id).emit("received message", {
        sent_by: { username },
        message,
        chatroom: {
          _id: chatroom._id,
          room_type: chatroom.room_type,
          name: chatroom.room_type === "GROUP" ? chatroom.name : username,
          message_seen_list: chatroom.message_seen_list,
        },
        updatedAt: new Date(),
      });
    }
  });
};
