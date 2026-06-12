import type { MetadataRoute } from "next";

// PWA 매니페스트 — '홈 화면에 추가' 시 앱처럼 동작
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "네오클라우드 인사이트",
    short_name: "네오클라우드",
    description:
      "오라클·코어위브·네비우스·아이렌 등 네오클라우드 기업의 수주잔고·전력 캐파·밸류에이션·실시간 뉴스를 한눈에.",
    start_url: "/",
    display: "standalone",
    background_color: "#F2F4F6",
    theme_color: "#3182F6",
    lang: "ko",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
  };
}
