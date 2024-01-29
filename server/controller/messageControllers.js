import ChatRoomModel from "../db/Model/ChatRoomModel.js";
import MessageModel from "../db/Model/MessageModel.js";

export const getMessages = async (req, res) => {
  try {
    const uid = req.uid;
    const chatroomid = req.params.chatroomid;
    const skip = req.query.skip;
    const chatroom = await ChatRoomModel.findById(chatroomid);
    if (chatroom.members.findIndex((member) => member._id.equals(uid)) === -1)
      throw new Error("User doesn't belong to this chatroom");
    const messages = await MessageModel.find(
      { chatroom: chatroomid },
      {
        createdAt: 1,
        updatedAt: 1,
        message: 1,
        sent_by: 1,
      }
    )
      .sort("-createdAt")
      .skip(skip)
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
    console.error(err);
    res.status(404);
    return res.json({ message: "Failed to fetch messages" });
  }
};
