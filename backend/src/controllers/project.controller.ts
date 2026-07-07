import { Request, Response, NextFunction } from "express";
import { assignMember, createProject, deleteProject, getProjectById, listMembers, listProject, removeMember, updateProject } from "../services/project.service.js";
import { success } from "zod";


//create project controller
export const createProjectController = async(request:Request,response:Response,next:NextFunction)=>{
    try {
        const project = await createProject(request.body);
        response.status(201).json(
            {
                success:true,
                message:"Project created successfully",
                data:project
            }
        )
        
    } catch (error) {
        next(error)
    }
}

//list project controller
export const listProjectController = async(_request:Request,response:Response,next:NextFunction)=>{
    try {
        const projects = await listProject()
        response.status(201).json(
            {
                success:true,
                message:"List All Projects",
                data:projects
            }
        )
        
    } catch (error) {
        next(error)
    }
}

//get project by id  controller
export const getProjectByIdController = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const id = Array.isArray(request.params.id) ? request.params.id[0] : request.params.id;
        const project = await getProjectById(id);
        response.status(200).json(
            { 
                success: true, 
                data: project 
            }
        );
    } catch (error) {
        next(error);
    }
};

//update project
export const updateProjectByIdController = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const id = Array.isArray(request.params.id) ? request.params.id[0] : request.params.id;
        const project = await updateProject(id,request.body);
        response.status(200).json(
            { 
                success: true, 
                message: "Project updated successfully",
                data: project 
            }
        );
    } catch (error) {
        next(error);
    }
};

//delete project
export const deleteProjectByIdController = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const id = Array.isArray(request.params.id) ? request.params.id[0] : request.params.id;
        const result = await deleteProject(id);
        response.status(200).json(
            { 
                success: true, 
                message: "Project deleted successfully",
                data: result 
            }
        );
    } catch (error) {
        next(error);
    }
};

//assign member to project
export const assignMemberController = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const id = Array.isArray(request.params.id) ? request.params.id[0] : request.params.id;
    const project = await assignMember(
      id,
      request.body.userId
    );
    response.status(200).json({
      success: true,
      message: "Team member assigned to project",
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

//remove member from project
export const removeMemberController = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
        const id = Array.isArray(request.params.id) ? request.params.id[0] : request.params.id;
        const userId = Array.isArray(request.params.userId) ? request.params.userId[0] : request.params.userId;
        const project = await removeMember(
            id,
            userId
        );
    response.status(200).json({
      success: true,
      message: "Team member removed from project",
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

//list Member Controller
export const listMembersController = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const id = Array.isArray(request.params.id) ? request.params.id[0] : request.params.id;
    const members = await listMembers(id);
    response.status(200).json(
        { 
            success: true, 
            data: members 
        }
    );
  } catch (error) {
    next(error);
  }
};