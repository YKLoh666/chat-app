import ChatRoomModel from "../db/Model/ChatRoomModel.js";
import UserModel from "../db/Model/UserModel.js";

export const getChatrooms = async (req, res) => {
  try {
    const skip = req.query.skip;
    const uid = req.uid;
    const chatrooms = await ChatRoomModel.find(
      { members: uid, newest_message: { $ne: null } },
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
        select: { _id: 0, username: 1, active: 1 },
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
        select: { _id: 1, username: 1, active: 1 },
      })
      .populate({
        path: "message_seen_list",
        populate: {
          path: "user",
          select: { _id: 0, username: 1 },
        },
      })
      .lean()
      .exec();

    if (chatroom.members.findIndex((member) => member._id.equals(uid)) === -1) {
      throw new Error("Chatroom not belongs to the user");
    }

    return res.json({
      chatroom: {
        ...chatroom,
        members: chatroom.members.map((member) => ({
          username: member.username,
          active: member.active,
        })),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(404);
    return res.json({ chatroom: false });
  }
};

export const getChatroomWithUsername = async (req, res) => {
  try {
    const username = req.query.username;
    const uid = req.uid;

    const anotherUser = await UserModel.findOne({ username }).exec();

    if (!anotherUser) throw new Error("User not found");

    let chatroom;
    if (anotherUser._id.equals(uid)) {
      chatroom = await ChatRoomModel.findOne(
        {
          members: [uid],
          room_type: "SELF",
        },
        {
          _id: 1,
        }
      ).exec();
    } else {
      chatroom = await ChatRoomModel.findOne(
        {
          members: {
            $all: [uid, anotherUser._id],
          },
        },
        {
          _id: 1,
        }
      ).exec();
    }

    return res.json({ chatroom: { _id: chatroom._id } });
  } catch (err) {
    console.error(err);
    res.status(404);
    return res.json({ chatroom: false });
  }
};
