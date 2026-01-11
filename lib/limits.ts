const MAX_POSTS_PER_WEEK = 3
const WEEK_MS = 7 * 24 * 60 * 60 * 1000

export function canPost(email: string) {
  if (typeof window === "undefined") return false

  const history =
    JSON.parse(localStorage.getItem("postHistory") || "{}")

  const now = Date.now()
  const recentPosts = (history[email] || []).filter(
    (time: number) => now - time < WEEK_MS
  )

  return recentPosts.length < MAX_POSTS_PER_WEEK
}

export function recordPost(email: string) {
  const history =
    JSON.parse(localStorage.getItem("postHistory") || "{}")

  if (!history[email]) history[email] = []

  history[email].push(Date.now())
  localStorage.setItem("postHistory", JSON.stringify(history))
}
