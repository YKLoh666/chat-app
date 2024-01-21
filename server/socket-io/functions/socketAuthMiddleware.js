import { Socket } from "socket.io";
import jwt from "jsonwebtoken";
import cookie from "cookie";
import cookieParser from "cookie-parser";

/**
 * @param {Socket} socket
 * @param {Function} next
 */
export const authMiddleware = async (socket, next) => {
  const cookies = socket.handshake.headers.cookie;
  if (!cookies) return;

  const cookiesParsed = cookie.parse(cookies);

  const token = cookieParser.signedCookie(
    cookiesParsed.jwt,
    process.env.COOKIE_SECRET
  );

  const { uid } = await jwt.verify(token, process.env.JWT_PRIVATE_KEY);

  if (!uid) return;
  else {
    socket.uid = uid;

    next();
  }
};
