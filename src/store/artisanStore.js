import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useArtisanStore = create(
  persist(
    (set, get) => ({
      profile: {
        id: null,
        name: '',
        email: '',
        phone: '',
        category: '',
        bio: '',
        rating: 0,
        totalJobs: 0,
        verified: false,
        avatar: '',
        location: '',
        skills: [],
        workingHours: {},
      },

      jobs: {
        pending: [],
        accepted: [],
        inProgress: [],
        completed: [],
        cancelled: [],
      },

      earnings: {
        today: 0,
        week: 0,
        month: 0,
        total: 0,
        transactions: [],
      },

      stats: {
        completedJobs: 0,
        averageRating: 0,
        responseTime: 0,
        acceptanceRate: 0,
        weeklyGrowth: 0,
      },

      schedule: {
        availability: {},
        bookings: [],
        blockedDates: [],
      },

      notifications: [],

      loading: {},
      errors: {},

      setProfile: (profileData) => set({ profile: { ...get().profile, ...profileData } }),

      updateProfile: (updates) => {
        set((s) => ({ profile: { ...s.profile, ...updates } }))
      },

      addJob: (job) =>
        set((state) => {
          const j = state.jobs || {}
          return {
            jobs: {
              ...j,
              pending: [
                ...(j.pending || []),
                {
                  ...job,
                  id: Date.now().toString(),
                  status: 'pending',
                  createdAt: new Date().toISOString(),
                },
              ],
            },
          }
        }),

      updateJobStatus: (jobId, newStatus) =>
        set((state) => {
          const j = state.jobs || {}
          const allJobs = [
            ...(j.pending || []),
            ...(j.accepted || []),
            ...(j.inProgress || []),
            ...(j.completed || []),
            ...(j.cancelled || []),
          ]
          const job = allJobs.find((item) => item.id === jobId)
          if (!job) return state

          const currentStatus = job.status
          const updatedJobs = { ...j }
          updatedJobs[currentStatus] = (updatedJobs[currentStatus] || []).filter((item) => item.id !== jobId)
          updatedJobs[newStatus] = [
            ...(updatedJobs[newStatus] || []),
            { ...job, status: newStatus, updatedAt: new Date().toISOString() },
          ]

          const result = { jobs: updatedJobs }

          if (newStatus === 'completed') {
            const amount = job.price || 0
            result.earnings = {
              today: state.earnings.today + amount,
              week: state.earnings.week + amount,
              month: state.earnings.month + amount,
              total: state.earnings.total + amount,
              transactions: [
                ...state.earnings.transactions,
                { id: Date.now().toString(), amount, date: new Date().toISOString(), jobId },
              ],
            }
            result.stats = {
              ...state.stats,
              completedJobs: state.stats.completedJobs + 1,
            }
          }

          return result
        }),

      setEarnings: (earningsData) => set({ earnings: { ...get().earnings, ...earningsData } }),

      addEarning: (transaction) =>
        set((state) => ({
          earnings: {
            today: state.earnings.today + transaction.amount,
            week: state.earnings.week + transaction.amount,
            month: state.earnings.month + transaction.amount,
            total: state.earnings.total + transaction.amount,
            transactions: [
              ...state.earnings.transactions,
              { ...transaction, id: Date.now().toString() },
            ],
          },
        })),

      setStats: (statsData) => set({ stats: { ...get().stats, ...statsData } }),

      updateStats: () =>
        set((state) => {
          const j = state.jobs || {}
          const pending = j.pending || []
          const accepted = j.accepted || []
          const inProgress = j.inProgress || []
          const completed = j.completed || []
          const allJobs = [...pending, ...accepted, ...inProgress, ...completed]
          const totalJobs = allJobs.length

          return {
            stats: {
              ...state.stats,
              completedJobs: completed.length,
              acceptanceRate:
                totalJobs > 0 ? (((accepted.length + inProgress.length) / totalJobs) * 100).toFixed(1) : 0,
            },
          }
        }),

      setSchedule: (scheduleData) => set({ schedule: { ...get().schedule, ...scheduleData } }),

      addBooking: (booking) =>
        set((state) => ({
          schedule: {
            ...state.schedule,
            bookings: [...state.schedule.bookings, { ...booking, id: Date.now().toString() }],
          },
        })),

      addNotification: (notification) =>
        set((state) => ({
          notifications: [
            { ...notification, id: Date.now().toString(), read: false, createdAt: new Date().toISOString() },
            ...state.notifications,
          ],
        })),

      markNotificationRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
        })),

      clearNotifications: () => set({ notifications: [] }),

      setLoading: (key, value) => set((s) => ({ loading: { ...s.loading, [key]: value } })),
      setError: (key, value) => set((s) => ({ errors: { ...s.errors, [key]: value } })),

      resetStore: () =>
        set({
          profile: {
            id: null,
            name: '',
            email: '',
            phone: '',
            category: '',
            bio: '',
            rating: 0,
            totalJobs: 0,
            verified: false,
            avatar: '',
            location: '',
            skills: [],
            workingHours: {},
          },
          jobs: { pending: [], accepted: [], inProgress: [], completed: [], cancelled: [] },
          earnings: { today: 0, week: 0, month: 0, total: 0, transactions: [] },
          stats: { completedJobs: 0, averageRating: 0, responseTime: 0, acceptanceRate: 0, weeklyGrowth: 0 },
          schedule: { availability: {}, bookings: [], blockedDates: [] },
          notifications: [],
          loading: {},
          errors: {},
        }),
    }),
    {
      name: 'herfa-artisan-v2',
      partialize: (state) => ({
        profile: state.profile,
        jobs: state.jobs,
        earnings: state.earnings,
        stats: state.stats,
        schedule: state.schedule,
        notifications: state.notifications,
      }),
    }
  )
)

export default useArtisanStore
