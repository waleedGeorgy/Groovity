import { type NextFunction, type Request, type Response } from "express";
import { getAuth } from "@clerk/express";
import { Message } from "../models/message.model.ts";
import { User } from "../models/user.model.ts";

export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { userId } = getAuth(req);
    const users = await User.find({ clerkID: { $ne: userId } });
    if (!users)
      return res.status(400).json({ message: "Could not fetch users" });

    return res.status(200).json(users);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const getAllMessages = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { userId: receiverId } = req.params;
    const { userId: senderId } = getAuth(req);

    const messages = await Message.find({
      $or: [
        { senderID: senderId, receiverID: receiverId },
        { senderID: receiverId, receiverID: senderId },
      ],
    }).sort({ createdAt: 1 });

    return res.status(200).json(messages);
  } catch (error) {
    console.log(error);
    next(error);
  }
};
