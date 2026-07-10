"use client";

import api from "@/services/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const useGetCategories = () =>
  useQuery({
    queryKey: ["categories"],
    queryFn: async () => { const { data } = await api.get("/categories"); return data; },
    staleTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
export const useCreateCategory = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data) => { const res = await api.post("/categories", data); return res; },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["categories"] }),
  });
};
