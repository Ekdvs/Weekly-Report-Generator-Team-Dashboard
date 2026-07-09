import { useCallback, useEffect, useState } from "react";
import type { Project } from "../types";
import { listProjectsRequest } from "../api/project.api";


export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await listProjectsRequest();
      setProjects(data.data);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      setError(err.response?.data?.message || "Failed to load projects");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void Promise.resolve().then(refetch);
  }, [refetch]);

  return { projects, isLoading, error, refetch };
};
