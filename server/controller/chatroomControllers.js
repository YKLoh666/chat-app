import ChatRoomModel from "../db/Model/ChatRoomModel.js";

export const getChatrooms = async (req, res) => {
  try {
    const uid = req.uid;
    const chatrooms = await ChatRoomModel.find(
      { members: uid },
      { __v: 0, updatedAt: 0 }
    )
      .populate({
        path: "message_updated",
        select: { _id: 0, sent_by: 1, updatedAt: 1, message: 1 },
        populate: {
          path: "sent_by",
          select: { _id: 0, username: 1 },
        },
      })
      .populate({
        path: "members",
        select: { _id: 0, username: 1 },
      })
      .populate({
        path: "message_seen_list",
        populate: {
          path: "user",
          select: { _id: 0, username: 1 },
        },
      })
      .exec();

    chatrooms.sort(
      (a, b) => b.message_updated.updatedAt - a.message_updated.updatedAt
    );

    return res.json({ chatrooms });
  } catch (err) {
    console.error(err);
    return res.json({ chatrooms: false });
  }
};
