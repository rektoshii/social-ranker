"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  getAllUsers,
  getCurrentUser,
  logout,
  type User,
} from "@/lib/auth";

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const router = useRouter();

  /* ---------- AUTH + LOAD USERS ---------- */
  useEffect(() => {
    const user = getCurrentUser();

    if (!user || user.role !== "admin") {
      router.replace("/");
      return;
    }

    setCurrentUser(user);

    const data = getAllUsers();
    setUsers(data);
  }, [router]);

  function handleLogout() {
    logout();
    router.replace("/login");
  }

  if (!currentUser) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <main className="p-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>

        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
        >
          Logout
        </button>
      </div>

      {/* Users */}
      {users.length === 0 ? (
        <p className="text-gray-500">No users found</p>
      ) : (
        <div className="space-y-4">
          {users.map((user) => (
            <div
              key={user.email}
              className="border p-4 rounded bg-white flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">{user.email}</p>
                <p className="text-sm text-gray-500">
                  Role: {user.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
