import User from "../db/Schema/User.js";
import { connectDB } from "../db/db.js";

export const registerUser = async (req, res) => {
  await connectDB();
  const newUser = new User({
    username: "Hello World",
    email: "helloworld@gmail.com",
  });

  newUser.save();

  console.log(`User added: ${newUser}`);

  return res.json({ success: true, newUser });
};
