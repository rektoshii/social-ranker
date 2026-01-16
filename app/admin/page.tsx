"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ADMIN_EMAIL,
  getAllUsers,
  saveAllUsers,
  getCurrentUser,
  logout,
  type User,
  type UserRole,
} from "@/lib/auth";

export default function AdminPage() {
  const [users, setUsers] = useState<Record<string, User>>({});
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  /* ---------------- AUTH GUARD ---------------- */

  useEffect(() => {
    const user = getCurrentUser();

    if (!user || user.email !== ADMIN_EMAIL) {
      router.replace("/");
      return;
    }

    setCurrentUser(user);
    setUsers(getAllUsers());
    setIsLoading(false);
  }, [router]);

  /* ---------------- HELPERS ---------------- */

  function updateUserRole(
    email: string,
    role: UserRole,
    approved: boolean
  ) {
    const updated = { ...users };

    updated[email] = {
      ...updated[email],
      role,
      approved,
    };

    saveAllUsers(updated);
    setUsers(updated);
  }

  function deleteUser(email: string) {
    if (!confirm(`Delete ${email}?`)) return;

    const updated = { ...users };
    delete updated[email];

    saveAllUsers(updated);
    setUsers(updated);
  }

  function handleLogout() {
    logout();
    router.push("/login");
  }

  /* ---------------- RENDER GUARD ---------------- */

  if (isLoading || !currentUser) {
    return <p style={{ padding: 20 }}>Loading…</p>;
  }

  /* ✅ CONVERT OBJECT → ARRAY ONCE */
  const userList = Object.values(users).sort((a, b) => {
    if (a.email === ADMIN_EMAIL) return -1;
    if (b.email === ADMIN_EMAIL) return 1;
    return b.createdAt - a.createdAt;
  });

  /* ---------------- UI ---------------- */

  return (
    <main style={{ maxWidth: 900, margin: "40px auto", padding: 20 }}>
      <header style={{ display: "flex", justifyContent: "space-between" }}>
        <h1>Admin Panel</h1>
        <button onClick={handleLogout}>Logout</button>
      </header>

      <hr style={{ margin: "20px 0" }} />

      {userList.length === 0 ? (
        <p>No users found</p>
      ) : (
        userList.map((user) => (
          <div
            key={user.email}
            style={{
              border: "1px solid #ddd",
              padding: 12,
              marginBottom: 10,
            }}
          >
            <p>
              <strong>{user.email}</strong>
            </p>
            <p>
              Role: <b>{user.role}</b> | Approved:{" "}
              <b>{user.approved ? "Yes" : "No"}</b>
            </p>

            {user.email !== ADMIN_EMAIL && (
              <div style={{ marginTop: 8 }}>
                <button
                  onClick={() =>
                    updateUserRole(user.email, "voter", true)
                  }
                >
                  Make Voter
                </button>{" "}
                <button
                  onClick={() =>
                    updateUserRole(user.email, "poster", true)
                  }
                >
                  Make Poster
                </button>{" "}
                <button
                  onClick={() =>
                    updateUserRole(user.email, "voter", false)
                  }
                >
                  Revoke
                </button>{" "}
                <button
                  onClick={() => deleteUser(user.email)}
                  style={{ color: "red" }}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </main>
  );
}
