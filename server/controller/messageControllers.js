import MessageModel from "../db/Model/MessageModel.js";
import ChatRoomModel from "../db/Model/ChatRoomModel.js";

export const getNewestMessage = async (req, res) => {
  const chatroomId = req.params.chatroomid;
  const uid = req.uid;

  try {
    const chatroom = await ChatRoomModel.findById(chatroomId, {
      members: 1,
      _id: 0,
    });

    if (
      chatroom.members.every((member) => {
        if (member.equals(uid)) return false;
        else return true;
      })
    ) {
      res.status(404);
      return res.end();
    }

    const message = await MessageModel.findOne(
      { chatroom: chatroomId },
      { sent_by: 1, message: 1, updatedAt: 1, _id: 0 }
    )
      .sort({ updatedAt: -1 })
      .populate({ path: "sent_by", select: { username: 1, _id: 0 } });

    return res.json({ message });
  } catch (err) {
    console.error(err);
    res.status(404);
    return res.json({ message: "Null" });
  }
};
