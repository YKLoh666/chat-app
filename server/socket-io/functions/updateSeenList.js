import ChatRoomModel from "../../db/Model/ChatRoomModel.js";

export const updateSeenList = async ({ chatroomid, username }) => {
  try {
    const chatroom = await ChatRoomModel.findById(chatroomid).populate({
      path: "message_seen_list.user",
      select: "username",
    });

    const index = chatroom.message_seen_list.findIndex(
      (el) => el.user.username === username
    );

    chatroom.message_seen_list[index].message_seen = 0;
    chatroom.message_seen_list[index].seen_date = Date.now();
    await chatroom.save();
  } catch (err) {
    console.error(err);
  }
};
