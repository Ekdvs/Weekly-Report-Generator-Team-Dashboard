import { useCallback, useEffect, useState } from "react";
import type { Report } from "../types";
import { getReportRequest } from "../api/report.api";


export const useReport = (id: string | undefined) => {
  const [report, setReport] = useState<Report | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await getReportRequest(id);
      setReport(data.data as Report);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e.response?.data?.message || "Failed to load report");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void Promise.resolve().then(refetch);
  }, [refetch]);

  return { report, isLoading, error, refetch };
};