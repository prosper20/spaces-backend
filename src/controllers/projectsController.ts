import { Request, Response } from "express";
import { db } from "../db";

export const createProject = async (req: Request, res: Response) => {
  const { title, description, groupId, dueDate, module, assigneeIds } = req.body;
  try {
    const project = await db.project.create({
      data: {
        title,
        description,
        groupId,
        dueDate,
        status: "active",
        module,
        assignees: {
          connect: assigneeIds.map((id: string) => ({ id })),
        },
      },
      include: { assignees: true },
    });
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ message: "Failed to create project", error: err });
  }
};