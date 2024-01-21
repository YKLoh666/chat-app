import UserModel from "../../db/Model/UserModel.js";

export const joinAuthRoom = async (uname, store, socket) => {
  const uid = socket.uid;

  try {
    const { username } = await UserModel.findById(uid, { _id: 0, username: 1 });

    if (username === uname) {
      store = { ...store, username, uid };
      socket.join("auth");
      socket.emit("authorize status", true);
      const newUserDoc = await UserModel.findByIdAndUpdate(uid, {
        socket_id: socket.id,
        active: true,
      });
    } else {
      socket.emit("authorize status", false);
    }
  } catch (err) {
    console.error(err);
  }
};
