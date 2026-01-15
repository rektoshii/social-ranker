"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login, ADMIN_EMAIL } from "@/lib/auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const user = login(email);

    if (!user) {
      setError("Invalid or unapproved user");
      return;
    }

    router.push("/");
  }

  return (
    <main style={{ maxWidth: 400, margin: "100px auto" }}>
      <h1>Login</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: "100%", padding: 10, marginBottom: 10 }}
        />

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button type="submit" style={{ padding: 10, width: "100%" }}>
          Login
        </button>

        <p style={{ marginTop: 10, fontSize: 12 }}>
          Admin email: <strong>{ADMIN_EMAIL}</strong>
        </p>
      </form>
    </main>
  );
}
