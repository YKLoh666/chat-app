import isEmail from "validator/lib/isEmail.js";
import User from "../db/Model/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  createDuoChatrooms,
  createToken,
  invalidateToken,
} from "../utilities.js";
import UserModel from "../db/Model/UserModel.js";

export const validateUser = async (req, res) => {
  if (!req.signedCookies.jwt) return res.json({ validated: false });
  try {
    const { uid } = await jwt.verify(
      req.signedCookies.jwt,
      process.env.JWT_PRIVATE_KEY
    );

    const user = await UserModel.findById(uid, { username: 1 });

    if (user) return res.json({ validated: true, username: user.username });
    else throw new Error(`Couldn't find user with uid ${uid}`);
  } catch (error) {
    console.error(error);
    res = invalidateToken(res);
    res.status(404);
    return res.json({ validated: false });
  }
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
    await createDuoChatrooms(newUser);
    res.cookie("jwt", createToken({ uid: newUser._id }), {
      httpOnly: true,
      signed: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    console.log(`User added: ${newUser.username}`);
    return res.json({ success: true, username: newUser.username });
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
    } else {
      message = error.message;
    }

    console.error(message);
    return res.json({ success: false, message });
  }
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
    console.error(err);
    return res.json({
      success: false,
      message: "Failed to login, please try again.",
    });
  }
};

export const updateStatus = async (req, res) => {
  try {
    const username = req.params.username;
    const { active, socketId, fromLogout } = req.body;
    const uid = req.uid;

    if (fromLogout) res = invalidateToken(res);

    const usernameFromDB = await User.findById(uid, { username: 1, _id: 0 });

    if (usernameFromDB.username !== username) {
      res.status(401);
      console.error("Unauthorized api call.");
      return res.json({});
    }

    await UserModel.updateOne(
      { username },
      {
        $set: {
          active,
          socket_id: socketId,
        },
      }
    );
    return res.end();
  } catch (err) {
    console.error(err);
    return console.error("Failed to update user status");
  }
};

export const logout = async (req, res, next) => {
  req.params.username = req.body.username;
  req.body = { ...req.body, active: false, socketId: "", fromLogout: true };

  next();
};
