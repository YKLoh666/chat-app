import mongoose from "mongoose";
import isEmail from "validator/lib/isEmail";

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Please enter an username"],
      unique: [true, ""],
    },
    email: {
      type: String,
      required: [true, "Please enter an email"],
      lowercase: true,
      unique: true,
      validate: [isEmail, "Please enter an valid email"],
    },
    password: {
      type: String,
      required: [true, "Please enter a password"],
    },
    active: {
      type: Boolean,
      default: false,
    },
    socket_id: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
