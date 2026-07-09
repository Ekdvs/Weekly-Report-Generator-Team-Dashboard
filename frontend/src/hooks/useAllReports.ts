import { useCallback, useEffect, useState } from "react";
import { allReportsRequest, type ReportQuery } from "../api/report.api";
import type { Pagination } from "../types";


export const useAllReports = (query: ReportQuery = {}) => {
  const [reports, setReports] = useState<Report[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const queryKey = JSON.stringify(query);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await allReportsRequest(query);
      setReports(data.data);
      setPagination(data.pagination ?? null);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      setError(err.response?.data?.message || "Failed to load team reports");
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryKey]);

  useEffect(() => {
    void Promise.resolve().then(refetch);
  }, [refetch]);

  return { reports, pagination, isLoading, error, refetch };
};
