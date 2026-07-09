import { useCallback, useEffect, useState } from "react";
import type { Role, User } from "../types";
import { listUsersRequest } from "../api/user.api";


export const useUsers = (role?: Role) => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await listUsersRequest(role);
      setUsers(data.data);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      setError(err.response?.data?.message || "Failed to load team members");
    } finally {
      setIsLoading(false);
    }
  }, [role]);

  useEffect(() => {
    void Promise.resolve().then(refetch);
  }, [refetch]);

  return { users, isLoading, error, refetch };
};
