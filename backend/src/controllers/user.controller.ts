import { Message } from "../models/message.model.ts";
import { User } from "../models/user.model.ts";

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({ clerkID: { $ne: req.auth().userId } });
    if (!users)
      return res.status(400).json({ message: "Could not fetch users" });

    return res.status(200).json(users);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const getAllMessages = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const myID = req.auth().userId;

    const messages = await Message.find({
      $or: [
        { senderID: myID, receiverID: userId },
        { senderID: userId, receiverID: myID },
      ],
    }).sort({ createdAt: 1 });

    return res.status(200).json(messages);
  } catch (error) {
    console.log(error);
    next(error);
  }
};
