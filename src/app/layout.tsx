import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";

export const metadata: Metadata = {
  title: "AMZ Toolbox - AI 驱动的亚马逊运营工具箱",
  description: "选品分析 · Listing全案 · 广告优化 · VOC分析 · 利润核算 · 视觉优化 · 多站点本地化",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" className="dark">
      <body className="flex">
        <Nav />
        <main className="flex-1 min-h-screen overflow-y-auto">
          {children}
        </main>
      </body>
    </html>
  );
}
