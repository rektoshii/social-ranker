// lib/auth.ts

export type UserRole = "admin" | "poster" | "voter";

export type User = {
  email: string;
  username: string;
  role: UserRole;
  approved: boolean;
  createdAt: number;
};

export const ADMIN_EMAIL = "adminme@gmail.com"; // CHANGE THIS

const USERS_KEY = "users";
const CURRENT_USER_KEY = "currentUser";

/* ---------------- USERS STORAGE ---------------- */

export function getAllUsers(): Record<string, User> {
  if (typeof window === "undefined") return {};
  const raw = localStorage.getItem(USERS_KEY);
  return raw ? JSON.parse(raw) : {};
}

export function saveAllUsers(users: Record<string, User>) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

/* ---------------- AUTH ---------------- */

export function login(email: string): User | null {
  const users = getAllUsers();
  const user = users[email];

  if (!user || !user.approved) return null;

  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  return user;
}

export function logout() {
  localStorage.removeItem(CURRENT_USER_KEY);
}

export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(CURRENT_USER_KEY);
  return raw ? JSON.parse(raw) : null;
}

/* ---------------- PERMISSIONS ---------------- */

export function canPost(user?: User | null) {
  return user?.approved && user.role === "poster";
}

export function canVote(user?: User | null) {
  return user?.approved && user.role === "voter";
}
