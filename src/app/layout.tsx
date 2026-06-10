import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Header } from "@/components/Header";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Ballot Brief — Research before you vote",
    template: "%s | Ballot Brief",
  },
  description:
    "Explore congressional candidates' voting records, sponsored legislation, and policy positions to make informed election decisions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-slate-50 text-slate-900">
        <Header />
        <div className="flex-1">{children}</div>
        <footer className="border-t border-slate-200 bg-white py-8 text-center text-sm text-slate-500">
          <p>
            Data sourced from{" "}
            <a
              href="https://www.congress.gov/"
              className="text-[#1e3a5f] hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Congress.gov
            </a>
            . Ballot Brief is an independent voter research tool.
          </p>
        </footer>
      </body>
    </html>
  );
}
