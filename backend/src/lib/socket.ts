import { Server } from "socket.io";
import { Message } from "../models/message.model.ts";

export const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });

  const userSockets = new Map();
  const userActivities = new Map();

  io.on("connection", (socket) => {
    socket.on("user_connected", (userId) => {
      userSockets.set(userId, socket.id);
      userActivities.set(userId, "Idle");

      io.emit("user_connected", userId);
      socket.emit("online_users", Array.from(userSockets.keys()));
      io.emit("user_activities", Array.from(userActivities.entries()));
    });

    socket.on("update_activity", ({ userId, activity }) => {
      userActivities.set(userId, activity);

      io.emit("activity_updated", { userId, activity });
    });

    socket.on("send_message", async (data) => {
      try {
        const { senderID, receiverID, contents } = data;

        const newMessage = await Message.create({
          senderID,
          receiverID,
          contents,
        });

        const receiverSocketID = userSockets.get(receiverID);
        if (receiverSocketID)
          io.to(receiverSocketID).emit("receive_message", newMessage);

        socket.emit("message_sent", newMessage);
      } catch (error) {
        socket.emit("error_message", error.message);
        console.log(error);
      }
    });

    socket.on("disconnect", () => {
      let disconnectedUserID;
      for (const [userId, socketId] of userSockets.entries()) {
        if (socketId === socket.id) {
          disconnectedUserID = userId;
          userSockets.delete(userId);
          userActivities.delete(userId);
          break;
        }
      }

      if (disconnectedUserID) io.emit("user_disconnected", disconnectedUserID);
    });
  });
};
