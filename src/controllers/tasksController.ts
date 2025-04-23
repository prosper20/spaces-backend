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
        assignee: true,
      },
    });
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: "Failed to create task", error: err });
  }
};