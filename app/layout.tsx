import "./globals.css";
import { Inter } from "next/font/google";
import { metadata } from "../app/metadata";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className={inter.className}>{children}</div>;
}
