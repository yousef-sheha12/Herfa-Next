"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/services/api";

export const useLogin = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data) => { const res = await api.post("/Auth/login", { email: data.email, password: data.password }); return res; },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["user"] }),
  });
};
export const useRegister = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data) => { const res = await api.post("/Auth/register", data); return res; },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["user"] }),
  });
};
export const useForgotPassword = () => {
  return useMutation({
    mutationFn: async (data) => { const res = await api.post("/Auth/forgot-password", { email: data.email }); return res; },
  });
};
export const useResetPassword = () => {
  return useMutation({
    mutationFn: async (data) => { const res = await api.post("/Auth/reset-password", data); return res; },
  });
};
export const useRefreshToken = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data) => { const res = await api.post("/Auth/refresh", { refreshToken: data.refreshToken }); return res; },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["user"] }),
  });
};
export const useLogout = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => { const res = await api.post("/Auth/logout", {}); return res; },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["user"] }),
  });
};
