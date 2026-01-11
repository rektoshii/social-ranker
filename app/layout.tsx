import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Social Ranker",
  description: "Content rating platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script async src="https://platform.twitter.com/widgets.js" charSet="utf-8"></script>
      </head>
      <body>{children}</body>
    </html>
  );
}