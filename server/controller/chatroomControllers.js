import ChatRoomModel from "../db/Model/ChatRoomModel.js";

export const getChatrooms = async (req, res) => {
  try {
    const uid = req.uid;
    const chatrooms = await ChatRoomModel.find(
      { members: uid },
      { __v: 0, updatedAt: 0 }
    )
      .sort("-message_updated")
      .populate({
        path: "members",
        select: { _id: 0, username: 1 },
      })
      .populate({
        path: "message_seen_list",
        match: { user: uid },
        populate: {
          path: "user",
          model: "User",
          select: { _id: 0, username: 1 },
        },
      })
      .exec();
    return res.json({ chatrooms });
  } catch (err) {
    return res.json({ chatrooms: false });
  }
};
