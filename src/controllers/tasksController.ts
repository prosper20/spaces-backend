import { Request, Response } from "express";
import { db } from "../db";

export const createTask = async (req: Request, res: Response) => {
  const { title, description, groupId, dueDate, assigneeId } = req.body;
  try {
    const task = await db.task.create({
      data: {
        title,
        description,
        dueDate,
        assigneeId,
        groupId,
      },
      include: {
        assignee: {
          select: {
            id: true,
            fullName: true,
            email: true,
            profile_picture: true,
          },
        },
      },
    });
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: "Failed to create task", error: err });
  }
};

export const getTasksByUser = async (req: Request, res: Response) => {
  const userId = req.userId;

  try {
    const tasks = await db.task.findMany({
      where: {
        assigneeId: userId,
      },
      include: {
        group: true,
        assignee: {
          select: {
            id: true,
            fullName: true,
            email: true,
            profile_picture: true,
          },
        },
      },
    });
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch tasks", error: err });
  }
};
