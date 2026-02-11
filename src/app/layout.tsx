import { Toaster } from "@/components/ui/sonner";
import type { Metadata } from "next";
// 1. Geist 및 Geist_Mono 폰트를 가져옵니다.
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// 2. 폰트 변수를 설정합니다.
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
    template: '%s | OP-CO-CA',
    default: 'OP-CO-CA - 기회비용 계산 플랫폼',
  },
  description: "나만의 기준으로 선택의 가치를 계산하고 공유하세요.",
  openGraph: {
    title: 'OP-CO-CA',
    description: '복잡한 결정, 수치로 명쾌하게.',
    url: 'https://op-co-ca.vercel.app',
    siteName: 'OP-CO-CA',
    images: [
      {
        url: 'https://op-co-ca.vercel.app/api/og?title=Better%20Choices',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'ko_KR',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      {/* 3. body 클래스에 Geist 폰트 변수를 적용합니다. antialiased는 글자를 더 매끄럽게 만듭니다. */}
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans`}>
        {children}
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  );
}