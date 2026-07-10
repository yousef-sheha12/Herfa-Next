"use client";

import api from "@/services/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetJobs = () =>
  useQuery({
    queryKey: ["jobs"],
    queryFn: async () => { const { data } = await api.get("/jobs"); return data; },
    staleTime: 2 * 60 * 1000,
  });
export const useGetJobsById = (id) =>
  useQuery({
    queryKey: ["job", id],
    queryFn: async () => { const { data } = await api.get(`/jobs/${id}`); return data; },
    staleTime: 2 * 60 * 1000,
  });
export const useCompleteJob = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id) => { const res = await api.patch(`/jobs/${id}/complete`); return res; },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["jobs"] }),
  });
};
export const useCancelJob = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id) => { const res = await api.patch(`/jobs/${id}/cancel`); return res; },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["jobs"] }),
  });
};
