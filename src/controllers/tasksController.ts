import { Request, Response } from "express";
import { db } from "../db";

export const createTask = async (req: Request, res: Response) => {
  const { title, description, groupId, dueDate, assigneeIds, status, tag, projectId } = req.body;
  const userId = req.userId;

  try {
    const task = await db.task.create({
      data: {
        title,
        description,
        dueDate,
        status,
        tag,
        createdBy: { connect: { id: userId } },
        group: { connect: { id: groupId } },
        project: projectId ? { connect: { id: projectId } } : undefined,
        assignees: {
          connect: assigneeIds.map((id: string) => ({ id })),
        },
      },
      include: {
        assignees: {
          select: {
            id: true,
            fullName: true,
            email: true,
            profile_picture: true,
          },
        },
        group: {
          select: {
            id: true,
            groupName: true,
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
        assignees: {
          some: {
            id: userId,
          },
        },
      },
      include: {
        assignees: {
          select: {
            id: true,
            fullName: true,
            email: true,
            profile_picture: true,
          },
        },
        // group: {
        //   select: {
        //     id: true,
        //     groupName: true,
        //   },
        // },
      },
    });

    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch tasks", error: err });
  }
};

export const getWeeklyContributions = async (req: Request, res: Response) => {
  const userId = req.userId;
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  try {
    const tasks = await db.task.findMany({
      where: {
        assignees: {
          some: {
            id: userId,
          },
        },
        status: "COMPLETED",
        updated_at: {
          gte: oneWeekAgo,
        },
      },
      orderBy: {
        updated_at: "desc",
      },
    });

    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch contributions", error: err });
  }
};

export const getAgendaForToday = async (req: Request, res: Response) => {
  const userId = req.userId;

  try {
    const tasks = await db.task.findMany({
      where: {
        assignees: {
          some: {
            id: userId,
          },
        },
        status: {
          in: ["TODO", "IN_PROGRESS"],
        },
      },
      orderBy: {
        created_at: "asc", // oldest first
      },
      take: 3,
    });

    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch today's agenda", error: err });
  }
};


export const getTaskStatusGraphData = async (req: Request, res: Response) => {
  const userId = req.userId;

  try {
    const [todo, inProgress, completed] = await Promise.all([
      db.task.count({
        where: {
          assignees: {
            some: { id: userId },
          },
          status: "TODO",
        },
      }),
      db.task.count({
        where: {
          assignees: {
            some: { id: userId },
          },
          status: "IN_PROGRESS",
        },
      }),
      db.task.count({
        where: {
          assignees: {
            some: { id: userId },
          },
          status: "COMPLETED",
        },
      }),
    ]);

    const total = todo + inProgress + completed || 1; // avoid division by 0
    res.status(200).json({
      todo: Math.round((todo / total) * 100),
      inProgress: Math.round((inProgress / total) * 100),
      completed: Math.round((completed / total) * 100),
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch task graph data", error: err });
  }
};

export const updateTaskStatus = async (req: Request, res: Response) => {
  const { taskId } = req.params;
  const { status } = req.body;

  if (!["TODO", "IN_PROGRESS", "COMPLETED"].includes(status)) {
    return res.status(400).json({ message: "Invalid status value" });
  }

  try {
    const updatedTask = await db.task.update({
      where: { id: taskId },
      data: { status },
      include: {
        assignees: {
          select: {
            id: true,
            fullName: true,
            email: true,
            profile_picture: true,
          },
        },
      },
    });

    res.status(200).json(updatedTask);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update task", error: err });
  }
};
