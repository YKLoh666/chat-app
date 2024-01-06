import mongoose from "mongoose";

const ChatRoomSchema = new mongoose.Schema(
  {
    room_type: {
      type: String,
      enum: ["SELF", "DUO", "GROUP"],
      default: "DUO",
    },
    public: {
      type: Boolean,
      default: true,
    },
    last_updated: {
      type: Date,
    },
    // Use .populate('field_name') to retrieve data as User instead of objectId
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("ChatRoom", ChatRoomSchema);
