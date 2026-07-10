import { useCallback, useEffect, useState } from "react";
import type { Pagination, Report, ReportStatus } from "../types";
import { allReportsRequest } from "../api/report.api";


interface UseAllReportsParams {
  userId?: string;
  projectId?: string;
  status?: ReportStatus | "";
  dateFrom?: string;
  dateTo?: string;
  page: number;
  limit: number;
}

interface UseAllReportsResult {
  reports: Report[];
  pagination: Pagination | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useAllReports = (
  params: UseAllReportsParams
): UseAllReportsResult => {
  const [reports, setReports] = useState<Report[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { userId, projectId, status, dateFrom, dateTo, page, limit } = params;

  const fetchReports = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await allReportsRequest({
        userId,
        projectId,
        status: status || undefined,
        dateFrom,
        dateTo,
        page,
        limit,
      });
      setReports(data.data as Report[]);
      setPagination(data.pagination ?? null);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e.response?.data?.message || "Failed to load reports");
    } finally {
      setIsLoading(false);
    }
  }, [userId, projectId, status, dateFrom, dateTo, page, limit]);

  useEffect(() => {
    void Promise.resolve().then(fetchReports);
  }, [fetchReports]);

  return { reports, pagination, isLoading, error, refetch: fetchReports };
};