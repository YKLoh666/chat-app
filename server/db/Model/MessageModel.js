import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    sent_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    chatroom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ChatRoom",
    },
    message: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Message", MessageSchema);
