"use client";

import {
  ADMIN_EMAIL,
  getAllUsers,
  saveAllUsers,
  getCurrentUser,
  logout,
  type UserRole,
} from "@/lib/auth";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const [users, setUsers] = useState<any>({});
  const [currentUser, setCurrentUser] = useState<any>(null);
  const router = useRouter();

  // Add user form state
  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserRole, setNewUserRole] = useState<UserRole>("viewer");
  const [newUserApproved, setNewUserApproved] = useState(true);
  const [addUserError, setAddUserError] = useState("");
  const [addUserSuccess, setAddUserSuccess] = useState("");

  useEffect(() => {
    const user = getCurrentUser();
    if (!user || user.email !== ADMIN_EMAIL) {
      router.push("/");
      return;
    }
    setCurrentUser(user);
    setUsers(getAllUsers());
  }, [router]);

  function updateUserRole(email: string, role: UserRole, approved: boolean) {
    const updated = { ...users };

    updated[email] = {
      ...updated[email],
      approved,
      role,
    };

    saveAllUsers(updated);
    setUsers(updated);
  }

  function handleAddUser(e: React.FormEvent) {
    e.preventDefault();
    setAddUserError("");
    setAddUserSuccess("");

    // Validation
    if (!newUserEmail.trim()) {
      setAddUserError("Please enter an email address");
      return;
    }

    if (!newUserEmail.includes("@")) {
      setAddUserError("Please enter a valid email address");
      return;
    }

    if (users[newUserEmail]) {
      setAddUserError("User with this email already exists");
      return;
    }

    // Create new user
    const updated = { ...users };
    const username = newUserEmail.split("@")[0];

    updated[newUserEmail] = {
      email: newUserEmail,
      username,
      role: newUserRole,
      approved: newUserApproved,
      createdAt: Date.now(),
    };

    saveAllUsers(updated);
    setUsers(updated);
    setAddUserSuccess(`Successfully added ${newUserEmail}`);

    // Reset form
    setTimeout(() => {
      setNewUserEmail("");
      setNewUserRole("viewer");
      setNewUserApproved(true);
      setShowAddUserForm(false);
      setAddUserSuccess("");
    }, 2000);
  }

  function deleteUser(email: string) {
    if (!confirm(`Are you sure you want to delete ${email}?`)) return;

    const updated = { ...users };
    delete updated[email];

    saveAllUsers(updated);
    setUsers(updated);
  }

  function handleLogout() {
    logout();
    router.push("/login");
  }

  if (!currentUser) {
    return <div className="p-6">Loading...</div>;
  }

  const userList = Object.values(users).sort((a: any, b: any) => {
    if (a.email === ADMIN_EMAIL) return -1;
    if (b.email === ADMIN_EMAIL) return 1;
    return b.createdAt - a.createdAt;
  });

  return (
    <main className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Panel</h1>
        <div className="flex gap-3">
          <button
            onClick={() => router.push("/")}
            className="text-blue-500 hover:underline"
          >
            Feed
          </button>
          <button
            onClick={() => router.push("/submit")}
            className="text-blue-500 hover:underline"
          >
            Submit
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-600 mb-1">Total Users</p>
          <p className="text-2xl font-bold text-blue-800">{userList.length}</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm text-green-600 mb-1">Approved</p>
          <p className="text-2xl font-bold text-green-800">
            {userList.filter((u: any) => u.approved).length}
          </p>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <p className="text-sm text-purple-600 mb-1">Voters</p>
          <p className="text-2xl font-bold text-purple-800">
            {userList.filter((u: any) => u.role === "voter").length}
          </p>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <p className="text-sm text-orange-600 mb-1">Posters</p>
          <p className="text-2xl font-bold text-orange-800">
            {userList.filter((u: any) => u.role === "poster").length}
          </p>
        </div>
      </div>

      {/* Add User Button */}
      <div className="mb-6">
        <button
          onClick={() => setShowAddUserForm(!showAddUserForm)}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold"
        >
          {showAddUserForm ? "✕ Cancel" : "+ Add User Manually"}
        </button>
      </div>

      {/* Add User Form */}
      {showAddUserForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 border-2 border-green-200">
          <h3 className="text-lg font-semibold mb-4">Add New User</h3>
          <form onSubmit={handleAddUser} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={newUserEmail}
                onChange={(e) => setNewUserEmail(e.target.value)}
                className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                placeholder="user@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role
              </label>
              <select
                value={newUserRole}
                onChange={(e) => setNewUserRole(e.target.value as UserRole)}
                className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
              >
                <option value="viewer">Viewer</option>
                <option value="voter">Voter</option>
                <option value="poster">Poster</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="approved"
                checked={newUserApproved}
                onChange={(e) => setNewUserApproved(e.target.checked)}
                className="mr-2 h-4 w-4"
              />
              <label htmlFor="approved" className="text-sm text-gray-700">
                Approve user immediately
              </label>
            </div>

            {addUserError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {addUserError}
              </div>
            )}

            {addUserSuccess && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                {addUserSuccess}
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="submit"
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold"
              >
                Add User
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddUserForm(false);
                  setNewUserEmail("");
                  setAddUserError("");
                  setAddUserSuccess("");
                }}
                className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg font-semibold"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Users List */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Manage Users</h2>

        {userList.length === 0 ? (
          <p className="text-gray-500">No users yet</p>
        ) : (
          <div className="space-y-3">
            {userList.map((user: any) => (
              <div
                key={user.email}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-medium text-lg">{user.email}</p>
                    <p className="text-sm text-gray-500">
                      Joined: {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        user.role === "admin"
                          ? "bg-red-100 text-red-800"
                          : user.role === "poster"
                          ? "bg-orange-100 text-orange-800"
                          : user.role === "voter"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {user.role}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        user.approved
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {user.approved ? "Approved" : "Pending"}
                    </span>
                  </div>
                </div>

                {user.email !== ADMIN_EMAIL && (
                  <div className="flex gap-2 flex-wrap">
                    <button
                      onClick={() => updateUserRole(user.email, "voter", true)}
                      className="px-3 py-1 border border-blue-500 text-blue-500 rounded hover:bg-blue-50 text-sm"
                    >
                      ✓ Approve as Voter
                    </button>
                    <button
                      onClick={() => updateUserRole(user.email, "poster", true)}
                      className="px-3 py-1 border border-orange-500 text-orange-500 rounded hover:bg-orange-50 text-sm"
                    >
                      ✓ Approve as Poster
                    </button>
                    <button
                      onClick={() => updateUserRole(user.email, "viewer", false)}
                      className="px-3 py-1 border border-gray-400 text-gray-600 rounded hover:bg-gray-50 text-sm"
                    >
                      Remove Approval
                    </button>
                    <button
                      onClick={() => deleteUser(user.email)}
                      className="px-3 py-1 border border-red-500 text-red-500 rounded hover:bg-red-50 text-sm ml-auto"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Info Box */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm font-semibold text-blue-800 mb-2">
          Role Permissions:
        </p>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>
            • <strong>Admin:</strong> Full access - can manage users and all features
          </li>
          <li>
            • <strong>Poster:</strong> Can submit tweets to the feed
          </li>
          <li>
            • <strong>Voter:</strong> Can upvote/downvote posts
          </li>
          <li>
            • <strong>Viewer:</strong> Can only view the feed (default for new signups)
          </li>
        </ul>
      </div>
    </main>
  );
}