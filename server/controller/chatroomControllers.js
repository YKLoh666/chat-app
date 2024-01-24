import ChatRoomModel from "../db/Model/ChatRoomModel.js";

export const getChatrooms = async (req, res) => {
  try {
    const skip = req.query.skip;
    const uid = req.uid;
    const chatrooms = await ChatRoomModel.find(
      { members: uid },
      { __v: 0, updatedAt: 0, createdAt: 0, newest_message_updatedAt: 0 }
    )
      .sort("-newest_message_updatedAt")
      .skip(skip)
      .limit(10)
      .populate({
        path: "newest_message",
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

    return res.json({ chatrooms });
  } catch (err) {
    console.error(err);
    return res.json({ chatrooms: false });
  }
};

export const getChatroom = async (req, res) => {
  try {
    const chatroomid = req.params.chatroomid;
    const uid = req.uid;
    const chatroom = await ChatRoomModel.findById(chatroomid, {
      __v: 0,
      updatedAt: 0,
      createdAt: 0,
      newest_message_updatedAt: 0,
    })
      .populate({
        path: "newest_message",
        select: { _id: 0, sent_by: 1, updatedAt: 1, message: 1 },
        populate: {
          path: "sent_by",
          select: { _id: 0, username: 1 },
        },
      })
      .populate({
        path: "members",
        select: { _id: 1, username: 1 },
      })
      .populate({
        path: "message_seen_list",
        populate: {
          path: "user",
          select: { _id: 0, username: 1 },
        },
      })
      .exec();

    if (chatroom.members.findIndex((member) => member._id.equals(uid)) === -1)
      throw new Error("Chatroom not belongs to the user");

    return res.json({ chatroom });
  } catch (err) {
    console.error(err);
    res.status(404);
    return res.json({ chatroom: false });
  }
};
