import { Role } from "@prisma/client";
import ApiError from "../utils/apiError.js";
export const authorize = (...allowedRoles) => (req, _res, next) => {
    if (!req.user) {
        return next(ApiError.unauthorized("Authentication required"));
    }
    if (!allowedRoles.includes(req.user.role)) {
        return next(ApiError.forbidden(`Access denied. Required role(s): ${allowedRoles.join(", ")}`));
    }
    next();
};
// Manager only
export const managerOnly = authorize(Role.MANAGER);
// Team Member only
export const teamMemberOnly = authorize(Role.TEAM_MEMBER);
// Both Manager & Team Member
export const anyRole = authorize(Role.MANAGER, Role.TEAM_MEMBER);
