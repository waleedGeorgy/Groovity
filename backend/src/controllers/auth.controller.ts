import { type NextFunction, type Response, type Request } from "express";
import { User } from "../models/user.model.ts";

type AuthBody = {
  id: string;
  firstName: string;
  lastName: string;
  imageUrl: string;
};

export const authCallback = async (
  req: Request<{}, {}, AuthBody>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id, firstName, lastName, imageUrl } = req.body;

    const user = await User.findOne({ clerkID: id });
    if (!user) {
      await User.create({
        clerkID: id,
        name: `${firstName || ""} ${lastName || ""}`.trim(),
        imageURL: imageUrl,
      });

      return res
        .status(200)
        .json({ success: true, message: "User authenticated successfully" });
    } else {
      return res.status(200).json({ success: true });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};
