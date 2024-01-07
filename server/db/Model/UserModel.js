import mongoose from "mongoose";
import isEmail from "validator/lib/isEmail.js";
import bcrypt from "bcrypt";

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Please enter an username"],
      unique: [true, "username already exists"],
    },
    email: {
      type: String,
      required: [true, "Please enter an email"],
      lowercase: true,
      unique: [true, "email already exists"],
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
      default: "",
    },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

export default mongoose.model("User", UserSchema);
