"use client";

import api from "@/services/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateRequest = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data) => { const res = await api.post("/Requests", data); return res; },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["requests"] });
      qc.invalidateQueries({ queryKey: ["notifications"] });
      qc.invalidateQueries({ queryKey: ["unreadNotifications"] });
    },
  });
};
export const useGetRequests = (enabled = true) =>
  useQuery({
    queryKey: ["requests"],
    queryFn: async () => { const { data } = await api.get("/Requests"); return data; },
    staleTime: 2 * 60 * 1000,
    enabled,
  });
export const useGetRequestById = (id) =>
  useQuery({
    queryKey: ["request", id],
    queryFn: async () => { const { data } = await api.get(`/Requests/${id}`); return data; },
    staleTime: 2 * 60 * 1000,
  });
export const useCancelRequest = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id) => { const res = await api.patch(`/Requests/${id}/cancel`); return res; },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["requests"] });
      qc.invalidateQueries({ queryKey: ["notifications"] });
      qc.invalidateQueries({ queryKey: ["unreadNotifications"] });
    },
  });
};

