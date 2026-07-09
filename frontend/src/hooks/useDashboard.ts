import { useCallback, useEffect, useState } from "react";
import type { ActivityRow, BlockerRow, DashboardFilters, DashboardSummary, SubmissionStatusRow, TrendPoint, WorkloadRow } from "../types";
import { getOpenBlockersRequest, getRecentActivityRequest, getSubmissionStatusRequest, getSummaryRequest, getTasksTrendRequest, getWorkloadByProjectRequest } from "../api/dashboard.api";


/** Summary cards + submission status + blockers + activity, refetched together as filters change. */
export const useDashboardOverview = (filters: DashboardFilters) => {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [submissionStatus, setSubmissionStatus] = useState<SubmissionStatusRow[]>([]);
  const [blockers, setBlockers] = useState<BlockerRow[]>([]);
  const [activity, setActivity] = useState<ActivityRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const filterKey = JSON.stringify(filters);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [summaryRes, statusRes, blockersRes, activityRes] = await Promise.all([
        getSummaryRequest(filters),
        getSubmissionStatusRequest(filters),
        getOpenBlockersRequest(filters),
        getRecentActivityRequest(filters),
      ]);
      setSummary(summaryRes.data.data);
      setSubmissionStatus(statusRes.data.data);
      setBlockers(blockersRes.data.data);
      setActivity(activityRes.data.data);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      setError(err.response?.data?.message || "Failed to load dashboard data");
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterKey]);

  useEffect(() => {
    void Promise.resolve().then(refetch);
  }, [refetch]);

  return { summary, submissionStatus, blockers, activity, isLoading, error, refetch };
};

export const useTasksTrend = (params: {
  weeks?: number;
  projectId?: string;
  userId?: string;
}) => {
  const [trend, setTrend] = useState<TrendPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const paramsKey = JSON.stringify(params);

  useEffect(() => {
    let active = true;
    const loadTrend = async () => {
      setIsLoading(true);
      try {
        const { data } = await getTasksTrendRequest(params);
        if (active) setTrend(data.data);
      } finally {
        if (active) setIsLoading(false);
      }
    };

    void loadTrend();
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramsKey]);

  return { trend, isLoading };
};

export const useWorkloadByProject = (params: {
  dateFrom?: string;
  dateTo?: string;
  userId?: string;
}) => {
  const [workload, setWorkload] = useState<WorkloadRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const paramsKey = JSON.stringify(params);

  useEffect(() => {
    let active = true;
    const loadWorkload = async () => {
      setIsLoading(true);
      try {
        const { data } = await getWorkloadByProjectRequest(params);
        if (active) setWorkload(data.data);
      } finally {
        if (active) setIsLoading(false);
      }
    };

    void loadWorkload();
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramsKey]);

  return { workload, isLoading };
};
