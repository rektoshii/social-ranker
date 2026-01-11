export const ADMIN_EMAIL = "admin@socialranker.com";

export type UserRole = "admin" | "voter" | "poster" | "viewer";

export type User = {
  email: string;
  username: string;
  role: UserRole;
  approved: boolean;
  createdAt: number;
};

export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null;
  return JSON.parse(localStorage.getItem("currentUser") || "null");
}

export function getAllUsers(): Record<string, User> {
  if (typeof window === "undefined") return {};
  return JSON.parse(localStorage.getItem("users") || "{}");
}

export function saveAllUsers(users: Record<string, User>) {
  localStorage.setItem("users", JSON.stringify(users));
}

export function login(email: string): User {
  const users = getAllUsers();
  const username = email.split("@")[0];

  // Check if user exists, if not create them
  if (!users[email]) {
    users[email] = {
      email,
      username,
      role: email === ADMIN_EMAIL ? "admin" : "viewer",
      approved: email === ADMIN_EMAIL, // Auto-approve admin
      createdAt: Date.now(),
    };
    saveAllUsers(users);
  }

  // Set current user
  localStorage.setItem("currentUser", JSON.stringify(users[email]));
  
  return users[email];
}

export function logout() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("currentUser");
}

export function isAuthenticated(): boolean {
  return getCurrentUser() !== null;
}

export function canPost(): boolean {
  const user = getCurrentUser();
  if (!user || !user.approved) return false;
  return user.role === "admin" || user.role === "poster";
}

export function canVote(): boolean {
  const user = getCurrentUser();
  if (!user || !user.approved) return false;
  return user.role === "admin" || user.role === "voter";
}