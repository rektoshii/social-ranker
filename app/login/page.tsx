"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

const ADMIN_EMAIL = "admin@example.com" // MUST MATCH auth.ts

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const router = useRouter()

  function handleLogin() {
    if (!email) {
      alert("Enter an email")
      return
    }

    const user = {
      email,
      role: email === ADMIN_EMAIL ? "admin" : "viewer",
      approved: email === ADMIN_EMAIL
    }

    localStorage.setItem("currentUser", JSON.stringify(user))

    router.push(user.role === "admin" ? "/admin" : "/")
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Login</h1>

      <input
        type="email"
        placeholder="Enter email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ border: "1px solid #ccc", padding: 8 }}
      />

      <br /><br />

      <button onClick={handleLogin}>
        Login
      </button>
    </div>
  )
}
