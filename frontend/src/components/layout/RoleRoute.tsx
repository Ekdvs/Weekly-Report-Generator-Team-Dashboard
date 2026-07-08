import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import type { Role } from "../../types";

export const RoleRoute = ({ allow }: { allow: Role[] }) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  if (!allow.includes(user.role)) {
    return <Navigate to="/reports" replace />;
  }

  return <Outlet />;
};
