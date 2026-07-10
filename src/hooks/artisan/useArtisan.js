"use client";

import api from "@/services/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const useGetArtisans = () =>
  useQuery({
    queryKey: ["artisans"],
    queryFn: async () => {
      const { data } = await api.get("/artisans");
      return data;
    },
    staleTime: 2 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

export const useGetArtisanProfile = (id) => {
  return useQuery({
    queryKey: ["artisanProfile", id],
    queryFn: async () => {
      const { data } = await api.get(`/artisans/${id}`);
      return data;
    },
    enabled: !!id,
    staleTime: 2 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: false,
  });
};
export const useCreateArtisanProfile = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (formData) => {
      const res = await api.post("/artisans/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res;
    },
    onSuccess: (_data, variables) => {
      if (variables?.userId)
        qc.invalidateQueries({
          queryKey: ["artisanProfile", variables.userId],
        });
      qc.invalidateQueries({ queryKey: ["artisans"] });
    },
  });
};
export const useUpdateArtisanProfile = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, bio, city, categoryId }) => {
      const res = await api.put(`/artisans/profile/${id}`, {
        bio: bio || "",
        city: city || "",
        categoryId: Number(categoryId),
      });
      return res;
    },
    onSuccess: (_data, variables) => {
      if (variables?.id)
        qc.invalidateQueries({
          queryKey: ["artisanProfile", variables.id],
        });
      qc.invalidateQueries({ queryKey: ["artisans"] });
    },
  });
};
export const useVerifyArtisan = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const res = await api.patch(`/artisans/${id}/verify`);
      return res;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["artisans"] }),
  });
};
export const useGetReviews = (id) =>
  useQuery({
    queryKey: ["artisan", id],
    queryFn: async () => {
      const { data } = await api.get(`/artisans/${id}/reviews`);
      return data;
    },
    staleTime: 2 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
