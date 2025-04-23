import { Request, Response } from "express";
import { db } from "../db";

export const createGroup = async (req: Request, res: Response) => {
  const { groupName, description, module, tags, supervisorId } = req.body;
  const creatorId = req.userId;

  try {
    const group = await db.group.create({
      data: {
        groupName,
        description,
        module,
        tags,
        supervisorId,
        members: {
          create: [{ userId: creatorId }],
        },
      },
      include: {
        members: true,
        supervisor: true,
      },
    });
    res.status(201).json(group);
  } catch (err) {
    res.status(500).json({ message: "Failed to create group", error: err });
  }
};

export const getGroupsByUser = async (req: Request, res: Response) => {
  const userId = req.userId;

  try {
    const groups = await db.group.findMany({
      where: {
        members: {
          some: { userId },
        },
      },
      include: {
        supervisor: true,
        members: { include: { user: true } },
      },
    });
    res.status(200).json(groups);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch groups", error: err });
  }
};