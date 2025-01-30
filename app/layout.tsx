import type { Metadata } from "next";
import "./globals.css";
import { Figtree } from "next/font/google";

const figtree = Figtree({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ATS.ai | Supercharge Your Hiring Process",
  description:
    "ATS.ai is a platform that leverages AI to streamline the recruitment process, helping you find the best candidates faster.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${figtree.className} antialiased`}>{children}</body>
    </html>
  );
}
