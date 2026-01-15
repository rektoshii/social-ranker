// lib/auth.ts

export type UserRole = "admin" | "voter" | "poster" | "viewer";

export interface User {
  email: string;
  role: UserRole;
}

/* ---------------- STORAGE HELPERS ---------------- */

function getUsersObject(): Record<string, User> {
  if (typeof window === "undefined") return {};

  const raw = localStorage.getItem("users");
  if (!raw) return {};

  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function saveUsersObject(users: Record<string, User>) {
  localStorage.setItem("users", JSON.stringify(users));
}

/* ---------------- AUTH ---------------- */

export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null;

  const raw = localStorage.getItem("currentUser");
  if (!raw) return null;

  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

export function logout() {
  localStorage.removeItem("currentUser");
}

/* ---------------- USERS ---------------- */

export function getAllUsers(): User[] {
  const usersObj = getUsersObject();
  return Object.values(usersObj);
}

export function registerUser(email: string) {
  const users = getUsersObject();

  if (!users[email]) {
    users[email] = {
      email,
      role: "viewer", // default role
    };
  }

  saveUsersObject(users);
  localStorage.setItem("currentUser", JSON.stringify(users[email]));
}

/* ---------------- ROLE CHECKS ---------------- */

export function canPost(user?: User | null): boolean {
  if (!user) return false;
  return user.role === "poster" || user.role === "admin";
}

export function canVote(user?: User | null): boolean {
  if (!user) return false;
  return user.role === "voter" || user.role === "admin";
}

/* ---------------- ADMIN ACTIONS ---------------- */

export function approvePoster(email: string) {
  const users = getUsersObject();
  if (!users[email]) return;

  users[email].role = "poster";
  saveUsersObject(users);
}

export function approveVoter(email: string) {
  const users = getUsersObject();
  if (!users[email]) return;

  users[email].role = "voter";
  saveUsersObject(users);
}
