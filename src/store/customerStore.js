import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useCustomerStore = create(
  persist(
    (set, get) => ({
      profile: {
        id: null,
        name: '',
        email: '',
        phone: '',
        avatar: '',
        location: '',
        preferences: {
          notifications: true,
          emailUpdates: true,
          smsAlerts: false,
        },
      },

      requests: {
        pending: [],
        accepted: [],
        inProgress: [],
        completed: [],
        cancelled: [],
      },

      serviceCategories: [],
      availableArtisans: [],
      nearbyArtisans: [],
      favoriteArtisans: [],

      searchFilters: {
        category: '',
        location: '',
        priceRange: [0, 1000],
        rating: 0,
        availability: 'any',
      },

      notifications: [],
      reviews: [],
      pendingReviews: [],

      loading: {},
      errors: {},

      setProfile: (profileData) => set({ profile: { ...get().profile, ...profileData } }),

      updateProfile: (updates) => {
        set((s) => ({ profile: { ...s.profile, ...updates } }))
      },

      createRequest: (requestData) =>
        set((state) => {
          const r = state.requests || {}
          const request = {
            ...requestData,
            icon: requestData.icon || 'droplet',
            id: Date.now().toString(),
            status: 'pending',
            createdAt: new Date().toISOString(),
          }
          return {
            requests: {
              ...r,
              pending: [...(r.pending || []), request],
            },
          }
        }),

      updateRequestStatus: (requestId, newStatus) =>
        set((state) => {
          const r = state.requests || {}
          const allRequests = [
            ...(r.pending || []),
            ...(r.accepted || []),
            ...(r.inProgress || []),
            ...(r.completed || []),
            ...(r.cancelled || []),
          ]
          const request = allRequests.find((req) => req.id === requestId)
          if (!request) return state

          const currentStatus = request.status
          const updatedRequests = { ...r }
          updatedRequests[currentStatus] = (updatedRequests[currentStatus] || []).filter((req) => req.id !== requestId)
          updatedRequests[newStatus] = [
            ...(updatedRequests[newStatus] || []),
            { ...request, status: newStatus, updatedAt: new Date().toISOString() },
          ]

          return { requests: updatedRequests }
        }),

      setAvailableArtisans: (artisans) => set({ availableArtisans: artisans }),
      setNearbyArtisans: (artisans) => set({ nearbyArtisans: artisans }),

      addFavoriteArtisan: (artisan) =>
        set((s) => ({
          favoriteArtisans: [...s.favoriteArtisans, { ...artisan, addedAt: new Date().toISOString() }],
        })),

      removeFavoriteArtisan: (id) =>
        set((s) => ({
          favoriteArtisans: s.favoriteArtisans.filter((a) => a.id !== id),
        })),

      isFavoriteArtisan: (id) => get().favoriteArtisans.some((a) => a.id === id),

      setSearchFilters: (filters) =>
        set((s) => ({
          searchFilters: { ...s.searchFilters, ...filters },
        })),

      addReview: (review) => set((s) => ({ reviews: [...s.reviews, review] })),
      addPendingReview: (artisanId) =>
        set((s) => ({
          pendingReviews: [...s.pendingReviews, artisanId],
        })),
      removePendingReview: (artisanId) =>
        set((s) => ({
          pendingReviews: s.pendingReviews.filter((id) => id !== artisanId),
        })),

      addNotification: (notification) =>
        set((s) => ({
          notifications: [
            ...s.notifications,
            { ...notification, id: Date.now().toString(), read: false, createdAt: new Date().toISOString() },
          ],
        })),

      markNotificationRead: (id) =>
        set((s) => ({
          notifications: s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
        })),

      markAllNotificationsRead: () =>
        set((s) => ({
          notifications: s.notifications.map((n) => ({ ...n, read: true })),
        })),

      clearNotifications: () => set({ notifications: [] }),

      getUnreadNotificationCount: () => get().notifications.filter((n) => !n.read).length,

      setLoading: (key, value) => set((s) => ({ loading: { ...s.loading, [key]: value } })),
      setError: (key, value) => set((s) => ({ errors: { ...s.errors, [key]: value } })),

      resetStore: () =>
        set({
          profile: {
            id: null,
            name: '',
            email: '',
            phone: '',
            avatar: '',
            location: '',
            preferences: { notifications: true, emailUpdates: true, smsAlerts: false },
          },
          requests: { pending: [], accepted: [], inProgress: [], completed: [], cancelled: [] },
          serviceCategories: [],
      availableArtisans: [],
          nearbyArtisans: [],
          favoriteArtisans: [],
          searchFilters: { category: '', location: '', priceRange: [0, 1000], rating: 0, availability: 'any' },
          notifications: [],
          reviews: [],
          pendingReviews: [],
          loading: {},
          errors: {},
        }),
    }),
    {
      name: 'herfa-customer-v2',
      partialize: (state) => ({
        profile: state.profile,
        requests: state.requests,
        favoriteArtisans: state.favoriteArtisans,
        searchFilters: state.searchFilters,
        notifications: state.notifications,
        reviews: state.reviews,
      }),
    }
  )
)

export default useCustomerStore
