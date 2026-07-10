"use client";

import api from "@/services/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateReview = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ jobId, ...data }) => { const res = await api.post(`/jobs/${jobId}/review`, data); return res; },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["reviews"] }),
  });
};
export const useGetReview = (jobId) =>
  useQuery({
    queryKey: ["review", jobId],
    queryFn: async () => { const { data } = await api.get(`/jobs/${jobId}/review`); return data; },
    staleTime: 2 * 60 * 1000,
  });
