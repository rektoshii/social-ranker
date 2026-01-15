import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Social Ranker",
  description: "Twitter content rating platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          async
          src="https://platform.twitter.com/widgets.js"
          charSet="utf-8"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}