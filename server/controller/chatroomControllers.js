import jwt from "jsonwebtoken";
import ChatRoomModel from "../db/Model/ChatRoomModel.js";

export const getChatrooms = async (req, res) => {
  try {
    const { uid } = await jwt.verify(
      req.signedCookies["jwt"],
      process.env.JWT_PRIVATE_KEY
    );
    const chatrooms = await ChatRoomModel.find(
      { members: uid },
      { _id: 0, __v: 0, updatedAt: 0 }
    )
      .populate("members", "username")
      .populate({
        path: "message_seen_list",
        match: { user: uid },
        populate: {
          path: "user",
          model: "User",
          select: "Username",
        },
      })
      .exec();
    return res.json({ success: true, chatrooms });
  } catch (err) {
    return res.json({ success: false, message: "Failed to load chatrooms" });
  }
};
