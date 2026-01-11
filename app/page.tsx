"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import { getAllPostsWithVotes } from "@/lib/storage"
import { getCurrentUser, logout, canPost } from "@/lib/auth"
import VoteButtons from "@/components/VoteButtons"

/* ---------------- TYPES ---------------- */

interface Post {
  id: string
  tweetUrl: string
  upvotes: number
  downvotes: number
  postedBy: string
}

interface User {
  email: string
  approved: boolean
  role: "admin" | "voter" | "poster"
}

/* ---------------- PAGE ---------------- */

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([])
  const [currentUser, setCurrentUser] = useState<User | null>(null)

  const router = useRouter()

  useEffect(() => {
    const user = getCurrentUser()

    if (!user) {
      router.replace("/login")
      return
    }

    setCurrentUser(user)
    setPosts(getAllPostsWithVotes())
  }, [])

  function handleLogout() {
    logout()
    router.replace("/login")
  }

  if (!currentUser) {
    return <div className="p-6">Loading...</div>
  }

  return (
    <main className="p-6 max-w-xl mx-auto">
      {/* ---------- HEADER ---------- */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Feed</h1>

        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">
            {currentUser.email}
          </span>

          {canPost() && (
            <button
              onClick={() => router.push("/submit")}
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
            >
              + Submit
            </button>
          )}

          <button
            onClick={() => router.push("/admin")}
            className="text-sm text-blue-500 hover:underline"
          >
            Admin
          </button>

          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
          >
            Logout
          </button>
        </div>
      </div>

      {/* ---------- POSTS ---------- */}
      {posts.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500 mb-2">No posts yet</p>

          {canPost() && (
            <button
              onClick={() => router.push("/submit")}
              className="text-blue-500 hover:underline text-sm"
            >
              Be the first to add a tweet!
            </button>
          )}
        </div>
      ) : (
        posts.map((post: Post) => {
          const score = post.upvotes * 2 - post.downvotes

          return (
            <div
              key={post.id}
              className="border border-gray-200 p-4 mb-4 rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white"
            >
              <iframe
                src={`https://twitframe.com/show?url=${post.tweetUrl}`}
                className="w-full rounded"
                height={300}
              />

              <div className="flex justify-between mt-3 text-sm text-gray-600">
                <span className="font-semibold">
                  Score: {score}
                </span>
                <span>
                  👍 {post.upvotes} | 👎 {post.downvotes}
                </span>
              </div>

              <VoteButtons postId={post.id} />

              <p className="text-xs text-gray-400 mt-2">
                Posted by {post.postedBy}
              </p>
            </div>
          )
        })
      )}
    </main>
  )
}
