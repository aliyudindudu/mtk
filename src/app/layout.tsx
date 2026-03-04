import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kuis Matematika - Ujian Sekolah",
  description: "Latihan soal matematika ujian sekolah kelas XII",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
