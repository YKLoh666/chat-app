import UserModel from "../../db/Model/UserModel.js";

export const disconnect = async (store, socket) => {
  socket.leave("auth");
  await UserModel.findOneAndUpdate(
    { username: store.username },
    { $set: { active: false, socket_id: "" } }
  );
  console.log(`user ${socket.id} is disconnected`);
};
