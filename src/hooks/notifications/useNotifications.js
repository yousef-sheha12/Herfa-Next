"use client";

import api from "@/services/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const useGetNotifications = (enabled = true) =>
  useQuery({
    queryKey: ["notifications"],
    queryFn: async () => { const { data } = await api.get("/notifications"); return data; },
    staleTime: 30 * 1000,
    refetchInterval: 30 * 1000,
    enabled,
  });
export const useGetUnreadNotifications = (enabled = true) =>
  useQuery({
    queryKey: ["unreadNotifications"],
    queryFn: async () => { const { data } = await api.get("/notifications/unread"); return data; },
    staleTime: 30 * 1000,
    refetchInterval: 30 * 1000,
    enabled,
  });
export const useReadNotification = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id) => { const res = await api.patch(`/notifications/${id}/read`); return res; },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["notifications"] });
      qc.invalidateQueries({ queryKey: ["unreadNotifications"] });
    },
  });
};
export const useReadAllNotifications = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => { const res = await api.patch("/notifications/read-all"); return res; },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["notifications"] });
      qc.invalidateQueries({ queryKey: ["unreadNotifications"] });
    },
  });
};
export const useDeleteNotification = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id) => { const res = await api.delete(`/notifications/${id}`); return res; },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["notifications"] });
      qc.invalidateQueries({ queryKey: ["unreadNotifications"] });
    },
  });
};
export const useClearAllNotifications = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => { const res = await api.delete("/notifications/clear-all"); return res; },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["notifications"] });
      qc.invalidateQueries({ queryKey: ["unreadNotifications"] });
    },
  });
};
