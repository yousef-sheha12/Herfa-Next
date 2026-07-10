"use client";

import api from "@/services/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const useGetClientDashboard = (enabled = true) =>
  useQuery({
    queryKey: ["clientDashboard"],
    queryFn: async () => { const { data } = await api.get("/clients/me/dashboard"); return data; },
    staleTime: 2 * 60 * 1000,
    enabled,
    retry: false,
  });
export const useGetClientProfile = (enabled = true) =>
  useQuery({
    queryKey: ["clientProfile"],
    queryFn: async () => { const { data } = await api.get("/clients/me/profile"); return data; },
    staleTime: 2 * 60 * 1000,
    enabled,
    retry: false,
  });
export const useUpdateClientProfile = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data) => { const res = await api.put("/clients/me/profile", data); return res; },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["clientProfile"] }),
  });
};


