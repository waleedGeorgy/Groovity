import { clerkClient, getAuth } from "@clerk/express";

export const protectRoute = (req: any, res: any, next: any): void => {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized. You must be logged in." });
    }
    next();
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const checkAdmin = async (
  req: any,
  res: any,
  next: any
): Promise<void> => {
  try {
    const { userId } = getAuth(req);
    const user = await clerkClient.users.getUser(userId as string);

    const isAdmin =
      user.primaryEmailAddress?.emailAddress === process.env.ADMIN_EMAIL;
    if (!isAdmin) {
      return res
        .status(403)
        .json({ message: "Unauthorized. Admin-only route." });
    }

    next();
  } catch (error) {
    console.log(error);
    next(error);
  }
};
