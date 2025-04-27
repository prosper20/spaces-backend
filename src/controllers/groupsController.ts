import { Request, Response } from "express";
import { db } from "../db";

export const createGroup = async (req: Request, res: Response) => {
  const { groupName, description, purpose, module, tags, supervisorId } = req.body;
  const creatorId = req.userId;

  try {
    const group = await db.group.create({
      data: {
        groupName,
        description,
        purpose,
        module,
        tags,
        supervisorId,
        members: {
          create: [
            { userId: creatorId },
          ],
        },
        groupRoles: {
          create: [
            {
              title: "Group Lead",
              description: "Oversees the team, assigns tasks, and ensures project timelines are met.",
              userId: creatorId,
            },
          ],
        },
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                email: true,
                profile_picture: true,
              },
            },
          },
        },
        groupRoles: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                email: true,
                profile_picture: true,
              },
            },
          },
        },
        supervisor: {
          select: {
            id: true,
            fullName: true,
            email: true,
            profile_picture: true,
          },
        },
      },
    });

    res.status(201).json(group);
  } catch (err) {
    console.error(err);
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
        supervisor: {
          select: {
            id: true,
            fullName: true,
            email: true,
            profile_picture: true,
          },
        },
        members: { include: { user: {
              select: {
                id: true,
                fullName: true,
                email: true,
                profile_picture: true,
              },
            }, } },
      },
    });
    res.status(200).json(groups);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch groups", error: err });
  }
};

export const getGroupById = async (req: Request, res: Response) => {
  const { groupId } = req.params;

  try {
    const group = await db.group.findUnique({
      where: {
        id: groupId,
      },
      include: {
        supervisor: {
          select: {
            id: true,
            fullName: true,
            email: true,
            profile_picture: true,
          },
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                email: true,
                role: true,
                profile_picture: true,
              },
            },
          },
        },
        groupRoles: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                email: true,
                profile_picture: true,
              },
            },
          },
        },
        tasks: {
          select: {
            id: true,
            title: true,
            description: true,
            dueDate: true,
            assignees: {
              select: {
                id: true,
                fullName: true,
                email: true,
                profile_picture: true,
              },
            },
          },
        },
        projects: {
          select: {
            id: true,
            title: true,
            description: true,
            dueDate: true,
            status: true,
          },
        },
        sessions: {
          select: {
            id: true,
            goal: true,
            date: true,
            time: true,
            duration: true,
          },
        },
        notes: {
          select: {
            id: true,
            title: true,
            content: true,
            created_at: true,
          },
        },
      },
    });

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    res.status(200).json(group);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch group details", error: err });
  }
};

export const getGroupDashboardData = async (req: Request, res: Response) => {
  const { groupId } = req.params;

  try {
    const group = await db.group.findUnique({
      where: { id: groupId },
      select: {
        id: true,
        groupName: true,
        description: true,
        purpose: true,
        module: true,
        tags: true,  
        tasks: {
          select: {
            id: true,
            title: true,
            description: true,
            dueDate: true,
            assignees: {
              select: {
                id: true,
                fullName: true,
                profile_picture: true,
              },
            },
          },
          orderBy: {
            dueDate: "asc", 
          },
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                email: true,
                role: true,
                profile_picture: true,
              },
            },
          },
        },
        sessions: {
          select: {
            id: true,
            goal: true,
            date: true,
            time: true,
            duration: true,
          },
          orderBy: {
            date: "asc",
          },
        },
        notes: {
          select: {
            id: true,
            title: true,
            created_at: true,
          },
          orderBy: {
            created_at: "desc",
          },
        },
        chat: {
          select: {
            id: true,
            messages: {
              select: {
                id: true,
                message: true,
                created_at: true,
              },
              orderBy: {
                created_at: "desc",
              },
              take: 5,
            },
          },
        },
      },
    });

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    res.status(200).json(group);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch dashboard data", error: err });
  }
};

