import Link from "next/link"

export default function Navbar() {
  return (
    <nav className="flex gap-6 p-4 border-b">
      <Link href="/">Feed</Link>
      <Link href="/submit">Submit</Link>
      <Link href="/leaderboard">Leaderboard</Link>
    <Link href="/admin">Admin</Link>
      
    </nav>
  )
}
