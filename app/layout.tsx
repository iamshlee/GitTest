import type { Metadata, Viewport } from "next";
import "./globals.css";
import BottomNav from "@/components/BottomNav";

export const metadata: Metadata = {
  title: "네오클라우드 인사이트",
  description:
    "오라클·코어위브·네비우스·아이렌 등 네오클라우드 기업의 수주잔고·전력 캐파·실시간 뉴스를 한눈에. 투자자를 위한 심플 대시보드.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "네오클라우드",
  },
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#F2F4F6",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        {/* 페인트 전 테마 적용 (FOUC 방지) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('neocloud:theme');if(!t){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}document.documentElement.setAttribute('data-theme',t);}catch(e){}})();`,
          }}
        />
      </head>
      <body className="font-sans">
        {/* 모바일 우선: 가운데 정렬된 폰 폭 컨테이너 */}
        <div className="mx-auto min-h-screen w-full max-w-[480px] bg-toss-bg pb-24">
          {children}
        </div>
        <BottomNav />
      </body>
    </html>
  );
}
