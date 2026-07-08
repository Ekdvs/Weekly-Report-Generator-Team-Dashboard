import { Request, Response, NextFunction } from "express";
import { AiChatInput, AiSummaryInput } from "../validators/ai.validator.js";
import { chatWithAssistant, generateTeamSummary } from "../services/ai.service.js";

// Ai controller chat
export const chatController = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { message, ...filters } = request.body as AiChatInput;
    const result = await chatWithAssistant(message, filters);
    response.status(200).json(
        { 
            success: true, 
            data: result 
        }
    );
  } catch (error) {
    next(error);
  }
};

// get team summary
export const teamSummaryController = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const filters = request.query as unknown as AiSummaryInput;
    const result = await generateTeamSummary(filters);
    response.status(200).json(
        { 
            success: true, 
            data: result 
        }
    );
  } catch (err) {
    next(err);
  }
};