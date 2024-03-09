import jwt from "jsonwebtoken";
import UserModel from "./db/Model/UserModel.js";
import ChatRoomModel from "./db/Model/ChatRoomModel.js";
import MessageModel from "./db/Model/MessageModel.js";

// Create a new jwt token
export const createToken = (data) => {
  return jwt.sign(data, process.env.JWT_PRIVATE_KEY, {
    expiresIn: "12h",
  });
};

// Authentication middleware for protecting routes
export const authMiddleware = async (req, res, next) => {
  const token = req.signedCookies.jwt;

  try {
    const { uid } = await jwt.verify(token, process.env.JWT_PRIVATE_KEY);

    req.uid = uid;
    next();
  } catch (error) {
    res.status(401);
    res.json({});
  }
};

// Invalidate the jwt token and return the response object
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

// Create a new duo chatroom
export const createDuoChatrooms = async (newUser) => {
  try {
    const listOfUser = await UserModel.find({}, { _id: 1 });
    const chatrooms = [];

    listOfUser.forEach((user) => {
      const room_type = user._id.equals(newUser._id) ? "SELF" : "DUO";

      chatrooms.push({
        room_type,
        name: "",
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

// Create random string
export const createRandomString = (length) => {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
};
