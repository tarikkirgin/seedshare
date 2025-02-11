import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SeedShare",
  description: "Streamlined P2P file sharing.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
