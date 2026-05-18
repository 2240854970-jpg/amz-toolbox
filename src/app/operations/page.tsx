"use client";

import { useState } from "react";

export default function OperationsPage() {
  const [file, setFile] = useState<File | null>(null);
  const [campaignName, setCampaignName] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleAnalyze = async () => {
    setLoading(true);
    setResult(null);
    try {
      // 实际：上传文件到 API，AI 分析 STR 数据
      await new Promise((r) => setTimeout(r, 2000));
    } catch { /* ignore */ }

    setResult(`【广告优化分析】${"─".repeat(40)}
Campaign：${campaignName || "SP-Core-001"}
分析时间范围：最近 14 天
数据来源：STR 报表

一、整体表现
  花费：$XXX.XX
  销售额：$X,XXX.XX
  ACoS：XX%
  ROAS：X.XX
  订单数：XX
  点击量：XXX

二、否词建议（低转化/无转化搜索词）
  ┌──────────────────────┬──────────┬────────┐
  │  搜索词               │  花费     │  订单  │
  ├──────────────────────┼──────────┼────────┤
  │ cheap yoga mat       │ $12.50   │   0    │
  │ yoga mat for kids    │  $8.30   │   0    │
  │ yoga mat wholesale   │ $15.20   │   0    │
  │ free yoga mat        │  $5.60   │   0    │
  └──────────────────────┴──────────┴────────┘

三、出价调整建议
  ⬆ "yoga mat non slip" CPC $1.20 → $1.50（高转化词）
  ⬇ "exercise mat" CPC $1.80 → $1.40（关联弱）
  ⬇ "yoga accessories" CPC $0.90 → $0.60（低点击率）
  ➡ "yoga mat thick" CPC $1.10 保持
  ⬆ "yoga mat for home" CPC $0.80 → $1.10（上升趋势）

四、预算重分配建议
  当前日预算 $100：
    Core Campaign：$45（↑ $5）
    Auto Campaign：$25（保持）
    Broad Campaign：$20（↓ $5）
    Category Campaign：$10（保持）

五、无效花费汇总
  无效花费识别：$XX.XX（占总花费 XX%）
  主要来源：广泛匹配无转化词

建议操作：
  1. 立即添加以上 4 个精准否定关键词
  2. 调整出价后观察 3-5 天
  3. 下次分析时间：3-5 天后重新上传 STR`);
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#f0f0f0]">广告优化</h1>
        <p className="text-sm text-[#a0a0a0] mt-1">上传 STR 报表 · AI 自动分析 · 否词 + 出价建议</p>
      </div>

      <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6 mb-6">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-[#a0a0a0] mb-2">Campaign 名称</label>
            <input
              type="text"
              value={campaignName}
              onChange={(e) => setCampaignName(e.target.value)}
              placeholder="例如：SP-Core-001"
              className="w-full px-4 py-3 bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg text-[#f0f0f0] placeholder-[#666] focus:outline-none focus:border-[#ff9900]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#a0a0a0] mb-2">上传 STR 报表</label>
            <label className="flex items-center justify-center w-full px-4 py-3 bg-[#0f0f0f] border border-dashed border-[#2a2a2a] rounded-lg cursor-pointer hover:border-[#ff9900]/50 transition-colors">
              <span className="text-sm text-[#666]">
                {file ? file.name : "点击上传 CSV / XLSX 文件"}
              </span>
              <input
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="hidden"
              />
            </label>
          </div>
        </div>

        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="w-full py-3 bg-[#ff9900] text-black font-semibold rounded-lg hover:bg-[#e68a00] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          {loading ? "分析中..." : "开始分析"}
        </button>
      </div>

      {result && (
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
          <h2 className="text-lg font-semibold text-[#f0f0f0] mb-4">广告优化报告</h2>
          <pre className="text-sm text-[#d0d0d0] leading-relaxed whitespace-pre-wrap font-mono bg-[#0f0f0f] rounded-lg p-5 max-h-[70vh] overflow-y-auto">
            {result}
          </pre>
        </div>
      )}
    </div>
  );
}
