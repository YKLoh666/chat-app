import { Socket } from "socket.io";
import jwt from "jsonwebtoken";
import cookie from "cookie";
import cookieParser from "cookie-parser";

/**
 * @param {Socket} socket
 * @param {Function} next
 */
export const authMiddleware = async (socket, next) => {
  const token = getToken(socket);
  if (!token) return;

  const { uid } = await jwt.verify(token, process.env.JWT_PRIVATE_KEY);

  if (!uid) return;
  else {
    socket.uid = uid;
    next();
  }
};

/**
 * @param {Socket} socket
 */
const getToken = (socket) => {
  const cookies = socket.handshake.headers.cookie;
  if (!cookies) return undefined;

  const cookiesParsed = cookie.parse(cookies);

  return cookieParser.signedCookie(
    cookiesParsed.jwt,
    process.env.COOKIE_SECRET
  );
};
