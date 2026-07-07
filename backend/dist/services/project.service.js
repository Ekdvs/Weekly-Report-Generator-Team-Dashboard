import prisma from "../config/prisma.js";
import ApiError from "../utils/apiError.js";
//create project
export const createProject = async (input) => {
    const existing = await prisma.project.findUnique({
        where: { name: input.name },
    });
    if (existing) {
        throw ApiError.conflict("A project with this name already exists");
    }
    return prisma.project.create({
        data: {
            name: input.name,
            description: input.description
        }
    });
};
//list all projects
export const listProject = async () => {
    return prisma.project.findMany({
        orderBy: { name: "asc" },
        include: {
            _count: { select: { reports: true } },
            members: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                }
            }
        }
    });
};
//get projectById
export const getProjectById = async (id) => {
    const project = await prisma.project.findUnique({
        where: { id },
        include: {
            _count: { select: { reports: true } },
            members: { select: { id: true, name: true, email: true, role: true } }
        }
    });
    if (!project) {
        throw ApiError.notFound("project not found");
    }
    return project;
};
//update project
export const updateProject = async (id, input) => {
    await getProjectById(id);
    if (input.name) {
        const nameToken = await prisma.project.findFirst({
            where: { name: input.name, NOT: { id } }
        });
        if (nameToken) {
            throw ApiError.conflict("A project with this name already exists");
        }
    }
    return prisma.project.update({
        where: { id },
        data: input,
    });
};
//delete project
export const deleteProject = async (id) => {
    const project = await prisma.project.findUnique({
        where: { id },
        include: { _count: { select: { reports: true } } },
    });
    if (!project) {
        throw ApiError.notFound("Project not found");
    }
    if (project._count.reports > 0) {
        throw ApiError.conflict("Cannot delete a project that already has reports attached to it");
    }
    await prisma.project.delete({ where: { id } });
    return { id };
};
//check user exists in data base
const ensureUserExists = async (userId) => {
    const user = await prisma.user.findUnique({
        where: { id: userId }
    });
    if (!user) {
        throw ApiError.badRequest("User does not exist");
    }
    return user;
};
//Assigns a team member to a project.
export const assignMember = async (projectId, userId) => {
    await getProjectById(projectId);
    await ensureUserExists(userId);
    return prisma.project.update({
        where: { id: projectId },
        data: {
            members: { connect: { id: userId } }
        },
        include: {
            members: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true
                }
            }
        }
    });
};
//Removes a team member from a project.
export const removeMember = async (projectId, userId) => {
    const project = await getProjectById(projectId);
    const isAssigned = project.members.some((m) => m.id === userId);
    if (!isAssigned) {
        throw ApiError.notFound("This user is not assigned to the project");
    }
    return prisma.project.update({
        where: { id: projectId },
        data: {
            members: { disconnect: { id: userId } },
        },
        include: {
            members: { select: { id: true, name: true, email: true, role: true } },
        },
    });
};
//Lists the team members currently assigned to a project.
export const listMembers = async (projectId) => {
    const project = await getProjectById(projectId);
    return project.members;
};
