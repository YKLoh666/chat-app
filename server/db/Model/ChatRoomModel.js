import mongoose from "mongoose";

const messageSeenSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message_seen: {
      type: Number,
    },
    seen_date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    _id: false,
  }
);

/**
 * chatroom {
 *  room_type: enum
 *  name: string
 *  public: bool
 *  members: [usersOid]
 *  message_updated: messageOid,
 *  message_seen_list: [{user: usersOid, message_seen: inc_number, seen_date: date }]
 * }
 */
const ChatRoomSchema = new mongoose.Schema(
  {
    room_type: {
      type: String,
      enum: {
        values: ["SELF", "DUO", "GROUP"],
        message: "{VALUE} is not supported",
      },
      default: "DUO",
    },
    name: {
      type: String,
      default: "New Group",
    },
    public: {
      type: Boolean,
      default: true,
    },
    // Use .populate('field_name') to retrieve data as User instead of objectId
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    message_updated: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
    message_seen_list: {
      type: [messageSeenSchema],
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("ChatRoom", ChatRoomSchema);
