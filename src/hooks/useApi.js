'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/services/api'
import useCustomerStore from '@/store/customerStore'
import useArtisanStore from '@/store/artisanStore'

export function useArtisanProfile() {
  return useQuery({
    queryKey: ['artisan-profile'],
    queryFn: async () => {
      const { data } = await api.get('/artisan/profile')
      return data
    },
    onSuccess: (data) => {
      useArtisanStore.getState().setProfile(data)
    },
  })
}

export function useArtisanJobs() {
  return useQuery({
    queryKey: ['artisan-jobs'],
    queryFn: async () => {
      const { data } = await api.get('/artisan/jobs')
      return data
    },
  })
}

export function useArtisanEarnings() {
  return useQuery({
    queryKey: ['artisan-earnings'],
    queryFn: async () => {
      const { data } = await api.get('/artisan/earnings')
      return data
    },
  })
}

export function useUpdateJobStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ jobId, status }) => {
      const { data } = await api.patch(`/artisan/jobs/${jobId}`, { status })
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['artisan-jobs'] })
      queryClient.invalidateQueries({ queryKey: ['artisan-earnings'] })
    },
  })
}

export function useCustomerProfile() {
  return useQuery({
    queryKey: ['customer-profile'],
    queryFn: async () => {
      const { data } = await api.get('/customer/profile')
      return data
    },
    onSuccess: (data) => {
      useCustomerStore.getState().setProfile(data)
    },
  })
}

export function useCustomerRequests() {
  return useQuery({
    queryKey: ['customer-requests'],
    queryFn: async () => {
      const { data } = await api.get('/customer/requests')
      return data
    },
  })
}

export function useCreateServiceRequest() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (requestData) => {
      const { data } = await api.post('/customer/requests', requestData)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customer-requests'] })
    },
  })
}

export function useServiceCategories() {
  return useQuery({
    queryKey: ['service-categories'],
    queryFn: async () => {
      const { data } = await api.get('/service-categories')
      return data
    },
  })
}

export function useSearchArtisans() {
  return useMutation({
    mutationFn: async (filters) => {
      const { data } = await api.post('/artisans/search', filters)
      return data
    },
  })
}

export function useNotifications(userType) {
  return useQuery({
    queryKey: ['notifications', userType],
    queryFn: async () => {
      const { data } = await api.get(`/notifications/${userType}`)
      return data
    },
  })
}

export function useCreateReview() {
  return useMutation({
    mutationFn: async (reviewData) => {
      const { data } = await api.post('/reviews', reviewData)
      return data
    },
  })
}
