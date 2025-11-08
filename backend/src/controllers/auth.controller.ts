import { User } from "../models/user.model.ts";

export const authCallback = async (
  req: any,
  res: any,
  next: any
): Promise<void> => {
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
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};
