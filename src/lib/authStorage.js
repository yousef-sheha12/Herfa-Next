export const getStoredUsers = () => {
  try {
    const data = localStorage.getItem("herfa-users");
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const saveStoredUsers = (users) => {
  localStorage.setItem("herfa-users", JSON.stringify(users));
};

export const findUserByEmail = (email) => {
  const users = getStoredUsers();
  return users.find((u) => u.email === email) || null;
};

export const createUser = (userData) => {
  const users = getStoredUsers();
  const newUser = {
    ...userData,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  users.push(newUser);
  saveStoredUsers(users);
  return newUser;
};

export const updateUserPassword = (email, newPassword) => {
  const users = getStoredUsers();
  const idx = users.findIndex((u) => u.email === email);
  if (idx === -1) return false;
  users[idx].password = newPassword;
  saveStoredUsers(users);
  return true;
};

export const setPendingSignup = (data) => {
  localStorage.setItem("herfa-pending-signup", JSON.stringify(data));
};

export const getPendingSignup = () => {
  try {
    const data = localStorage.getItem("herfa-pending-signup");
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

export const clearPendingSignup = () => {
  localStorage.removeItem("herfa-pending-signup");
};

export const setPasswordResetEmail = (email) => {
  localStorage.setItem("herfa-password-reset-email", email);
};

export const getPasswordResetEmail = () => {
  return localStorage.getItem("herfa-password-reset-email");
};

export const clearPasswordResetEmail = () => {
  localStorage.removeItem("herfa-password-reset-email");
};

export const getToken = () => {
  try {
    const data = localStorage.getItem("herfa-auth");
    return data ? JSON.parse(data).token : null;
  } catch {
    return null;
  }
};

export const setAuth = (user, token) => {
  if (user && user.role) {
    user.role = user.role.toLowerCase();
    if (user.role === "client") user.role = "customer";
  }
  localStorage.setItem("herfa-auth", JSON.stringify({ user, token }));
};

export const clearAuth = () => {
  localStorage.removeItem("herfa-auth");
};
