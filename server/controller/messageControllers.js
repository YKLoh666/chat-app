import MessageModel from "../db/Model/MessageModel.js";

export const getMessages = async (req, res) => {
  try {
    const chatroomid = req.params.chatroomid;
    const step = req.query.step;
    const messages = await MessageModel.find(
      { chatroom: chatroomid },
      {
        updatedAt: 1,
        message: 1,
        sent_by: 1,
        _id: 0,
      }
    )
      .sort("-createdAt")
      .skip(step)
      .limit(20)
      .populate({
        path: "sent_by",
        select: {
          _id: 0,
          username: 1,
        },
      });

    return res.json({ messages });
  } catch (err) {
    res.status(404);
    return res.json({ message: "Failed to fetch messages" });
  }
};
