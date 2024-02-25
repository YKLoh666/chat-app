import mongoose from "mongoose";
import bcrypt from "bcrypt";

const PasswordResetSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

PasswordResetSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.token = await bcrypt.hash(this.token, salt);
  next();
});

export default mongoose.model("PasswordReset", PasswordResetSchema);
