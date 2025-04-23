import { Request, Response } from "express";
import { db } from "../db";

// Get all users with optional search and pagination
export const getAllUsers = async (req: Request, res: Response) => {
  const search = (req.query.search as string) || "";
  const { page = 1, limit = 10 } = req.query;
  const parsedPage = parseInt(page as string);
  const parsedLimit = parseInt(limit as string);

  try {
    const users = await db.user.findMany({
      select: {
        id: true,
        fullName: true,
        email: true,
        profile_picture: true,
        role: true,
      },
      where: {
        OR: [
          { fullName: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
        ],
      },
      skip: (parsedPage - 1) * parsedLimit,
      take: parsedLimit,
    });

    res.status(200).json({ users, numFound: users.length });
  } catch (err) {
    res.status(500).json({ message: "Failed to retrieve users", error: err });
  }
};

// Update a user's profile
export const editUser = async (req: Request, res: Response) => {
  const { fullName, email, profile_picture } = req.body;
  const userId = req.userId; // assuming `userId` is populated by middleware

  try {
    const user = await db.user.update({
      where: { id: userId },
      data: {
        fullName: fullName?.trim() || undefined,
        email: email?.trim() || undefined,
        profile_picture: profile_picture || undefined,
      },
    });

    const response = {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      profile_picture: user.profile_picture,
      role: user.role,
    };

    res.json(response);
  } catch (err: any) {
    console.error(err);
    if (err.code === "P2002") {
      return res.status(403).json({ message: "Email already in use" });
    }
    res.status(500).json({ message: "Failed to update user", error: err });
  }
};
