"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

interface NavGroup {
  label: string;
  phase: string;
  items: { href: string; label: string; desc: string }[];
}

const navGroups: NavGroup[] = [
  {
    label: "选品期",
    phase: "selection",
    items: [
      { href: "/selection", label: "选品分析", desc: "5种选品方法 · 11板块报告" },
      { href: "/selection/procurement", label: "采购需求书", desc: "一键甩给1688供应商" },
    ],
  },
  {
    label: "上架期",
    phase: "listing",
    items: [
      { href: "/listing", label: "Listing全案", desc: "6步流程 · 三源融合文案" },
      { href: "/listing/strategy", label: "上架策略", desc: "定价 · STAG广告 · 20周预测" },
    ],
  },
  {
    label: "运营期",
    phase: "operations",
    items: [
      { href: "/operations", label: "广告优化", desc: "STR分析 · 否词出价建议" },
      { href: "/operations/voc", label: "VOC分析", desc: "12板块洞察 · KANO模型" },
      { href: "/operations/profit", label: "利润核算", desc: "逐SKU拆真实利润" },
      { href: "/operations/returns", label: "退货分析", desc: "原因分类 · 改进路线图" },
    ],
  },
  {
    label: "优化期",
    phase: "optimization",
    items: [
      { href: "/optimization", label: "文案优化", desc: "老品诊断 · Before/After" },
      { href: "/optimization/visual", label: "视觉优化", desc: "图片诊断 · AI双轨出图" },
      { href: "/optimization/localization", label: "多站点本地化", desc: "不是翻译，是重写" },
    ],
  },
];

export default function Nav() {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState<string | null>(null);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <nav className="w-64 min-h-screen bg-[#111] border-r border-[#2a2a2a] flex flex-col shrink-0">
      {/* Logo */}
      <Link href="/" className="px-6 py-5 border-b border-[#2a2a2a] block">
        <span className="text-xl font-bold">
          <span className="text-[#ff9900]">AMZ</span>
          <span className="text-[#f0f0f0]">Toolbox</span>
        </span>
        <p className="text-xs text-[#666] mt-1">AI 驱动的亚马逊运营工具箱</p>
      </Link>

      {/* Nav groups */}
      <div className="flex-1 overflow-y-auto py-3 px-3 space-y-1">
        {navGroups.map((group) => (
          <div key={group.phase}>
            <button
              onClick={() => setExpanded(expanded === group.phase ? null : group.phase)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium text-[#a0a0a0] hover:text-[#f0f0f0] hover:bg-[#1a1a1a] transition-colors"
            >
              <span>{group.label}</span>
              <svg
                className={`w-4 h-4 transition-transform ${expanded === group.phase ? "rotate-90" : ""}`}
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {expanded === group.phase && (
              <div className="ml-2 mt-1 space-y-0.5">
                {group.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                      isActive(item.href)
                        ? "bg-[#ff9900]/10 text-[#ff9900] border-l-2 border-[#ff9900]"
                        : "text-[#a0a0a0] hover:text-[#f0f0f0] hover:bg-[#1a1a1a]"
                    }`}
                  >
                    <div className="font-medium">{item.label}</div>
                    <div className="text-xs text-[#666] mt-0.5">{item.desc}</div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-[#2a2a2a] text-xs text-[#666]">
        <p>Claude Code 搭建</p>
        <p>Next.js + AI + Sorftime MCP</p>
      </div>
    </nav>
  );
}
