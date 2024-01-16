import jwt from "jsonwebtoken";
import UserModel from "./db/Model/UserModel.js";
import ChatRoomModel from "./db/Model/ChatRoomModel.js";

export const createToken = (data) => {
  return jwt.sign(data, process.env.JWT_PRIVATE_KEY, {
    expiresIn: "12h",
  });
};

export const invalidateToken = (res) => {
  res.cookie("jwt", "", {
    maxAge: 0,
    httpOnly: true,
    signed: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });

  return res;
};

export const createDuoChatrooms = async (newUser) => {
  try {
    const listOfUser = await UserModel.find({}, { _id: 1 });
    const chatrooms = [];

    listOfUser.forEach((user) => {
      const room_type = user._id.equals(newUser._id) ? "SELF" : "DUO";

      chatrooms.push({
        room_type,
        members: room_type === "DUO" ? [user._id, newUser._id] : [newUser._id],
        message_seen_list:
          room_type === "DUO"
            ? [{ user: user._id }, { user: newUser._id }]
            : [{ user: newUser._id }],
      });
    });

    const chatroomDocuments = chatrooms.map(
      (chatroom) => new ChatRoomModel(chatroom)
    );

    await ChatRoomModel.insertMany(chatroomDocuments);

    return;
  } catch (err) {
    throw new Error("Failed to create chatroom");
  }
};
