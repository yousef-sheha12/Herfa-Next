"use client";

import api from "@/services/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateOffer = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ requestId, price, message }) => {
      const res = await api.post(`/Offers/request/${Number(requestId)}`, { price: Number(price), message });
      return res;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["offers"] });
      qc.invalidateQueries({ queryKey: ["requests"] });
      qc.invalidateQueries({ queryKey: ["notifications"] });
      qc.invalidateQueries({ queryKey: ["unreadNotifications"] });
    },
  });
};
export const useGetOffersByRequest = (requestId) =>
  useQuery({
    queryKey: ["offers", requestId],
    queryFn: async () => { const { data } = await api.get(`/Offers/request/${requestId}`); return data; },
    staleTime: 2 * 60 * 1000,
    enabled: !!requestId,
    retry: false,
  });
export const useAcceptOffer = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (offerId) => { const res = await api.patch(`/Offers/${Number(offerId)}/accept`); return res; },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["offers"] });
      qc.invalidateQueries({ queryKey: ["requests"] });
      qc.invalidateQueries({ queryKey: ["notifications"] });
      qc.invalidateQueries({ queryKey: ["unreadNotifications"] });
      qc.invalidateQueries({ queryKey: ["artisans"] });
      qc.invalidateQueries({ queryKey: ["artisanProfile"] });
      qc.invalidateQueries({ queryKey: ["jobs"] });
    },
  });
};
export const useRejectOffer = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (offerId) => { const res = await api.patch(`/Offers/${Number(offerId)}/reject`); return res; },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["offers"] });
      qc.invalidateQueries({ queryKey: ["requests"] });
      qc.invalidateQueries({ queryKey: ["notifications"] });
      qc.invalidateQueries({ queryKey: ["unreadNotifications"] });
    },
  });
};

