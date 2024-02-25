import isEmail from "validator/lib/isEmail.js";
import User from "../db/Model/UserModel.js";
import PasswordResetModel from "../db/Model/PasswordResetModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  createDuoChatrooms,
  createRandomString,
  createToken,
  invalidateToken,
} from "../utilities.js";
import nodemailer from "nodemailer";

const testAccount = await nodemailer.createTestAccount();

const transporter = nodemailer.createTransport({
  host: testAccount.smtp.host,
  port: testAccount.smtp.port,
  secure: testAccount.smtp.secure,
  auth: {
    user: testAccount.user,
    pass: testAccount.pass,
  },
});

export const searchUsers = async (req, res) => {
  const searchString = decodeURIComponent(req.query.search);
  const skip = Number(req.query.skip);
  try {
    const users = await User.aggregate([
      {
        $match: {
          username: {
            $regex: searchString,
            $options: "i",
          },
        },
      },
      {
        $project: {
          username: 1,
          active: 1,
          _id: 0,
        },
      },
      {
        $addFields: {
          matchIndex: {
            $indexOfCP: [{ $toLower: "$username" }, { $toLower: searchString }],
          },
        },
      },
      {
        $sort: {
          matchIndex: 1,
          username: 1,
        },
      },
      {
        $skip: skip,
      },
      {
        $limit: 10,
      },
    ]);

    return res.json({ users });
  } catch (error) {
    console.error(error);
    res.status(500);
    return res.json({ success: false, message: "Internal server error" });
  }
};

export const validateUser = async (req, res) => {
  if (!req.signedCookies.jwt) return res.json({ validated: false });
  try {
    const { uid } = await jwt.verify(
      req.signedCookies.jwt,
      process.env.JWT_PRIVATE_KEY
    );

    const user = await User.findById(uid, { username: 1 });

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

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  const userFile = await User.findOne({ email });

  if (!userFile) {
    return res.json({ success: false, message: "User not found" });
  }

  const resetPasswordInstance = await PasswordResetModel.findOne({
    user: userFile._id,
  });

  if (resetPasswordInstance) {
    return res.json({
      success: false,
      message: "Password reset email has been sent",
    });
  }

  const token = createRandomString(30);

  const message = {
    from: "ykdev.noreply <noreply@ykdev.com>",
    to: email,
    subject: "Reset your password",
    html:
      "<p>You are receiving this email because you (or someone else) have requested the reset of the password for your account.</p>" +
      "<p>Please click on the following link, or paste this into your browser to complete the process:</p>" +
      `<a href="${process.env.PUBLIC_BASE_URL}/reset-password?token=${token}">${process.env.PUBLIC_BASE_URL}/resetpassword?token=${token}</a>` +
      "<p>The link will be not effective after 1 hour, please reset your password in the interval.</p>" +
      "<p>If you are not the one who request for the password reset, please ignore this email.</p>",
  };

  const passwordResetFile = new PasswordResetModel({
    user: userFile._id,
    token,
  });

  try {
    await passwordResetFile.save();
  } catch (error) {
    res.status(500);
    return res.json({
      success: false,
      message: "Failed to send email, please try again later",
    });
  }

  transporter.sendMail(message, (err, info) => {
    if (err) {
      console.error(err.message);
      res.status(500);
      return res.json({
        success: false,
        message: "Failed to send email, please try again later",
      });
    }
    console.log(`Recovery email sent: ${info.messageId}`);
    const url = nodemailer.getTestMessageUrl(info);
    console.log(`Preview URL: ${url}`);
    res.json({ success: true, mail: url });
  });
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

    await User.updateOne(
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
