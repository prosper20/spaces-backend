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
      include: {
        assignees: {
          select: {
            id: true,
            fullName: true,
            email: true,
            profile_picture: true,
            created_at: true,
            updated_at: true,
          },
        },
        group: true,
      },
    });
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ message: "Failed to create project", error: err });
  }
};

export const getProjectsByUser = async (req: Request, res: Response) => {
  const userId = req.userId;

  try {
    const projects = await db.project.findMany({
      where: {
        assignees: {
          some: { id: userId },
        },
      },
      include: {
        assignees: {
          select: {
            id: true,
            fullName: true,
            email: true,
            profile_picture: true,
            created_at: true,
            updated_at: true,
          },
        },
        group: true,
      },
    });
    res.status(200).json(projects);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch projects", error: err });
  }
};


// export const createProject = async (req: Request, res: Response) => {
//   const { title, description, groupId, dueDate, module, assigneeIds } = req.body;
//   try {
//     const project = await db.project.create({
//       data: {
//         title,
//         description,
//         groupId,
//         dueDate,
//         status: "active",
//         module,
//         assignees: {
//           connect: assigneeIds.map((id: string) => ({ id })),
//         },
//       },
//       include: { assignees: true },
//     });
//     res.status(201).json(project);
//   } catch (err) {
//     res.status(500).json({ message: "Failed to create project", error: err });
//   }
// };