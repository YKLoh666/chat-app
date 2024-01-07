import User from "../db/Model/UserModel.js";

export const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  const newUser = new User({
    username,
    email,
    password,
  });

  try {
    await newUser.save();
  } catch (error) {
    let message;
    if (error.code === 11000) {
      const duplicateField = Object.keys(error.keyPattern)[0];

      switch (duplicateField) {
        case "username":
          message = "Username already exists";
          break;
        case "email":
          message = "Email already exists";
          break;
        default:
          message = "Duplicate value error";
      }
    }

    console.log(message);
    return res.json({ success: false, message });
  }
  console.log(`User added: ${newUser}`);
  return res.json({ success: true, newUser });
};
