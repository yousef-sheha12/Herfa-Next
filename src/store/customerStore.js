import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const defaultServiceCategories = [
  { id: 1, name: 'Plumbing', icon: 'Wrench' },
  { id: 2, name: 'Electrical', icon: 'Zap' },
  { id: 3, name: 'Carpentry', icon: 'Hammer' },
  { id: 4, name: 'HVAC', icon: 'Thermometer' },
  { id: 5, name: 'Painting', icon: 'Paintbrush' },
  { id: 6, name: 'Cleaning', icon: 'SprayCan' },
  { id: 7, name: 'Gardening', icon: 'Flower2' },
  { id: 8, name: 'Appliance Repair', icon: 'Settings' },
]

const mockArtisans = [
  { id: 1, name: 'Ahmed Hassan', specialty: 'Plumbing', rating: 4.9, location: { lat: 30.0444, lng: 31.2357 }, price: 150 },
  { id: 2, name: 'Fatima Ali', specialty: 'Electrical', rating: 4.8, location: { lat: 30.056, lng: 31.226 }, price: 200 },
  { id: 3, name: 'Omar Mahmoud', specialty: 'Carpentry', rating: 4.7, location: { lat: 30.05, lng: 31.24 }, price: 180 },
  { id: 4, name: 'Layla Ibrahim', specialty: 'Painting', rating: 4.9, location: { lat: 30.048, lng: 31.23 }, price: 120 },
]

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

      serviceCategories: defaultServiceCategories,
      availableArtisans: mockArtisans,
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

      searchArtisans: (filters = {}) => {
        const results = mockArtisans.filter((a) => {
          if (filters.category && a.specialty !== filters.category) return false
          if (filters.rating && a.rating < filters.rating) return false
          if (filters.priceRange) {
            if (a.price < filters.priceRange[0] || a.price > filters.priceRange[1]) return false
          }
          return true
        })
        set({ availableArtisans: results, loading: { ...get().loading, search: false } })
      },

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
          serviceCategories: defaultServiceCategories,
          availableArtisans: mockArtisans,
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
