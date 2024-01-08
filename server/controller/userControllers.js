import isEmail from "validator/lib/isEmail.js";
import User from "../db/Model/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const validateUser = async (req, res) => {
  if (!req.signedCookies.jwt) return res.json({ validated: false });
  const validate = jwt.verify(
    req.signedCookies.jwt,
    process.env.JWT_PRIVATE_KEY
  );
  if (!validate) return res.json({ validated: false });
  return res.json({ validated: true });
};

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
  const token = createToken({ uid: newUser._id });
  res.cookie("jwt", token, {
    maxAge: 12 * 60 * 60 * 1000,
    httpOnly: true,
    signed: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });
  console.log(`User added: ${newUser.username}`);
  return res.json({ success: true, username: newUser.username });
};

export const loginUser = async (req, res) => {
  if (req.signedCookies.jwt) {
    return res.json({ success: false, message: "Haven't Log out" });
  }

  const { uid, password, rmbMe } = req.body;
  try {
    let user;
    if (isEmail(uid)) {
      user = await User.findOne({ email: uid });
    } else {
      user = await User.findOne({ username: uid });
    }

    if (await bcrypt.compare(password, user.password)) {
      if (rmbMe) {
        res.cookie("jwt", createToken({ uid: user._id }), {
          maxAge: 12 * 60 * 60 * 1000,
          httpOnly: true,
          signed: true,
          sameSite: "strict",
          secure: process.env.NODE_ENV === "production",
        });
      } else {
        res.cookie("jwt", createToken({ uid: user._id }), {
          httpOnly: true,
          signed: true,
          sameSite: "strict",
          secure: process.env.NODE_ENV === "production",
        });
      }

      return res.json({ success: true });
    } else {
      return res.json({
        success: false,
        message: "Wrong Credential, please try again.",
      });
    }
  } catch (err) {
    return res.json({
      success: false,
      message: "Wrong Credential, please try again.",
    });
  }
};

export const logout = async (req, res) => {
  res.cookie("jwt", "", {
    maxAge: 0,
    httpOnly: true,
    signed: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });

  return res.json({ success: true });
};

const createToken = (data) => {
  return jwt.sign(data, process.env.JWT_PRIVATE_KEY, {
    expiresIn: "12h",
  });
};
