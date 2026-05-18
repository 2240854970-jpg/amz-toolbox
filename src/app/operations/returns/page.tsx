"use client";

import { useState } from "react";

export default function ReturnsPage() {
  const [file, setFile] = useState<File | null>(null);
  const [asin, setAsin] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleAnalyze = async () => {
    setLoading(true);
    setResult(null);
    await new Promise((r) => setTimeout(r, 2000));

    setResult(`【退货分析报告】${"─".repeat(40)}
ASIN：${asin || "B0XXXXXXX"}
分析周期：最近 90 天
数据来源：亚马逊退货报告

一、退货总览
  总订单数：XXX
  退货总数：XX
  退货率：XX%
  退货金额：$X,XXX.XX
  行业平均退货率：X%

二、退货原因分类
  ┌──────────────────────┬──────┬────────┐
  │  退货原因              │ 数量  │ 占比   │
  ├──────────────────────┼──────┼────────┤
  │ 产品与描述不符         │  12  │  34%   │
  │ 质量缺陷               │   8  │  23%   │
  │ 尺寸不合适             │   6  │  17%   │
  │ 不再需要               │   5  │  14%   │
  │ 运输损坏               │   3  │   9%   │
  │ 其他                   │   1  │   3%   │
  └──────────────────────┴──────┴────────┘

三、根因分析
  🔴 "产品与描述不符"（34%）
     → 可能原因：Listing 图片/文案过度美化
     → 影响：客户预期与实物差距大

  🔴 "质量缺陷"（23%）
     → 可能原因：批次品控不稳定
     → 影响：评分下降 + 差评扩散

  🟡 "尺寸不合适"（17%）
     → 可能原因：尺寸标注不清晰，缺少参照物图片
     → 影响：可通过优化 Listing 改善

四、改进路线图
  优先级 1（立即）：
    → 更新 Listing 图片，增加真实尺寸对比图
    → 修正文案中过度夸大的描述

  优先级 2（1周内）：
    → 联系工厂排查最近批次品控流程
    → 增加出厂全检比例

  优先级 3（2周内）：
    → 优化包装缓冲材料，减少运输损坏
    → A+ 页面增加"如何选择尺寸"指南

  优先级 4（1月内）：
    → 建立退货预警机制（退货率 > X% 自动告警）
    → 对比竞品退货数据，定位行业水位

五、成本影响
  当前退货成本：$X,XXX/月（退货 + FBA 处理费 + 仓储）
  降低退货率 3% 可节省：$XXX/月
  年度节省预估：$X,XXX

💡 建议：每月定期跑一次退货分析，监控退货率趋势。`);
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#f0f0f0]">退货分析</h1>
        <p className="text-sm text-[#a0a0a0] mt-1">退货原因自动分类 · 根因分析 · 改进路线图</p>
      </div>

      <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6 mb-6">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-[#a0a0a0] mb-2">ASIN（可选）</label>
            <input type="text" value={asin} onChange={(e) => setAsin(e.target.value)}
              placeholder="例如：B0XXXXXXX"
              className="w-full px-4 py-3 bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg text-[#f0f0f0] placeholder-[#666] focus:outline-none focus:border-[#ff9900]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#a0a0a0] mb-2">上传退货报表</label>
            <label className="flex items-center justify-center w-full px-4 py-3 bg-[#0f0f0f] border border-dashed border-[#2a2a2a] rounded-lg cursor-pointer hover:border-[#ff9900]/50 transition-colors">
              <span className="text-sm text-[#666]">{file ? file.name : "CSV / Excel 退货报表"}</span>
              <input type="file" accept=".csv,.xlsx,.xls" onChange={(e) => setFile(e.target.files?.[0] || null)} className="hidden" />
            </label>
          </div>
        </div>
        <button onClick={handleAnalyze} disabled={loading}
          className="w-full py-3 bg-[#ff9900] text-black font-semibold rounded-lg hover:bg-[#e68a00] disabled:opacity-40 transition-all"
        >
          {loading ? "分析中..." : "开始退货分析"}
        </button>
      </div>

      {result && (
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
          <h2 className="text-lg font-semibold text-[#f0f0f0] mb-4">退货分析报告</h2>
          <pre className="text-sm text-[#d0d0d0] leading-relaxed whitespace-pre-wrap font-mono bg-[#0f0f0f] rounded-lg p-5 max-h-[70vh] overflow-y-auto">{result}</pre>
        </div>
      )}
    </div>
  );
}
