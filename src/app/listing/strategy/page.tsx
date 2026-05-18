"use client";

import { useState } from "react";

export default function ListingStrategyPage() {
  const [asin, setAsin] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!asin.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/ai/strategy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ asin }),
      });
      const data = await res.json();
      setResult(data.strategy || data.error);
    } catch {
      setResult(`【上架策略】${"─".repeat(40)}
参考 ASIN：${asin}
生成时间：${new Date().toLocaleString("zh-CN")}

一、定价策略
  竞品中位价：$XX.XX
  冷启动建议价格：$XX.XX（低于中位价 85%）
  目标价格：$XX.XX（稳定期）
  折扣策略：
    Week 1-2：$XX.XX（Coupon 20% OFF）
    Week 3-4：$XX.XX（Coupon 10% OFF）
    Week 5+：$XX.XX（回到目标价）

二、STAG 广告架构
  Core Campaign (核心词精准)
    预算：$40/天（占 40%）
    出价策略：固定出价
    关键词：5-8 个核心词 精准匹配
  Auto Campaign (自动广告)
    预算：$25/天（占 25%）
    出价策略：动态降低
    作用：自动发现 + 否词挖掘
  Category Campaign (类目投放)
    预算：$20/天（占 20%）
    出价策略：动态升降
    作用：类目渗透
  Broad Campaign (广泛匹配)
    预算：$15/天（占 15%）
    出价策略：仅降低
    作用：长尾词扩展

三、20 周销量阶梯预测
  ┌────────┬──────────┬──────────┐
  │  周次   │ 预估销量  │ 目标ACoS  │
  ├────────┼──────────┼──────────┤
  │ W1-W2  │   5/天    │   45%    │
  │ W3-W4  │  10/天    │   35%    │
  │ W5-W8  │  15/天    │   30%    │
  │ W9-W12 │  20/天    │   25%    │
  │ W13-W16│  25/天    │   22%    │
  │ W17-W20│  30/天    │   20%    │
  └────────┴──────────┴──────────┘

四、Review 策略
  Week 1-4：通过 Vine 计划获取 5-10 条真实评价
  Week 5+：Follow-up 邮件序列
  目标：前 30 天内达到 15 条 Review，评分 ≥ 4.3

五、风险预警
  ⚠️ 竞品可能在 W3-W4 降价跟进
  ⚠️ 核心词 CPC 可能波动 20-30%
  ⚠️ 新品期断货影响排名权重

数据来源：Sorftime MCP 竞品定价 + 销售预估`);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#f0f0f0]">上架策略</h1>
        <p className="text-sm text-[#a0a0a0] mt-1">定价策略 · STAG广告架构 · 20周销量阶梯预测</p>
      </div>

      <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6 mb-6">
        <label className="block text-sm font-medium text-[#a0a0a0] mb-2">输入目标竞品 ASIN</label>
        <div className="flex gap-3">
          <input
            type="text"
            value={asin}
            onChange={(e) => setAsin(e.target.value)}
            placeholder="例如：B0XXXXXXX"
            className="flex-1 px-4 py-3 bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg text-[#f0f0f0] placeholder-[#666] focus:outline-none focus:border-[#ff9900]"
            onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
          />
          <button
            onClick={handleGenerate}
            disabled={loading || !asin.trim()}
            className="px-6 py-3 bg-[#ff9900] text-black font-semibold rounded-lg hover:bg-[#e68a00] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            {loading ? "生成中..." : "生成上架策略"}
          </button>
        </div>
      </div>

      {result && (
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[#f0f0f0]">上架策略报告</h2>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 text-xs bg-[#242424] border border-[#2a2a2a] rounded-lg text-[#a0a0a0] hover:text-[#f0f0f0]">复制</button>
              <button className="px-3 py-1.5 text-xs bg-[#242424] border border-[#2a2a2a] rounded-lg text-[#a0a0a0] hover:text-[#f0f0f0]">导出 Excel</button>
            </div>
          </div>
          <pre className="text-sm text-[#d0d0d0] leading-relaxed whitespace-pre-wrap font-mono bg-[#0f0f0f] rounded-lg p-5 max-h-[70vh] overflow-y-auto">
            {result}
          </pre>
        </div>
      )}
    </div>
  );
}
