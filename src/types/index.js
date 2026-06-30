export const mockAuth = {
  user: null,
  token: null,
}

export const formatUserData = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  phone: user.phone || '',
  avatar: user.avatar || '',
  createdAt: user.createdAt || new Date().toISOString(),
})
