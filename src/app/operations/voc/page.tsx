"use client";

import { useState } from "react";

export default function VOCPage() {
  const [asin, setAsin] = useState("");
  const [reviewCount, setReviewCount] = useState(100);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!asin.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      await new Promise((r) => setTimeout(r, 2500));
    } catch { /* ignore */ }

    setResult(`【VOC 深度分析报告】${"─".repeat(40)}
ASIN：${asin}
分析 Review 数：${reviewCount} 条
数据来源：Sorftime MCP Review 查询
生成时间：${new Date().toLocaleString("zh-CN")}

一、Review 统计
  总评分数：X.X 星
  正面评价：XX%
  中性评价：XX%
  负面评价：XX%
  Vine 评价占比：XX%

二、KANO 模型分析
  🟢 基本型需求（Must-Have）：
    • 产品功能正常运作
    • 包装完好无损
    • 与描述一致
    • 材质安全无毒

  🔵 期望型需求（Performance）：
    • 耐用性（使用 3 个月后状态）
    • 清洁方便性
    • 配件齐全
    • 尺寸准确性

  🟡 兴奋型需求（Delight）：
    • 超出预期的质感
    • 附赠小配件/贴纸
    • 包装可重复使用
    • 快速响应客服

  ⚪ 无差异需求（Indifferent）：
    • 说明书语言版本数量
    • 外包装颜色

  🔴 反向需求（Reverse）：
    • 过度包装不环保
    • 过多的品牌营销卡片

三、Top 痛点排名
  ┌────┬──────────────────────┬──────┬────────┐
  │ 排名 │  痛点                  │ 频次  │ 严重度 │
  ├────┼──────────────────────┼──────┼────────┤
  │  1  │ 材质不如预期           │  45  │   高   │
  │  2  │ 使用X周后出现磨损       │  32  │   高   │
  │  3  │ 尺寸偏小               │  28  │   中   │
  │  4  │ 配件缺失               │  15  │   中   │
  │  5  │ 异味                   │  12  │   低   │
  └────┴──────────────────────┴──────┴────────┘

四、消费者画像
  主要使用者：25-45岁女性
  使用场景：家庭日常
  购买动机：健康、性价比
  决策因素：材质安全性 > 价格 > 品牌 > 设计

五、改进路线图
  优先级 1（立即）：材质升级，选用更高级别原料
  优先级 2（2周内）：增加尺寸对照表在Listing
  优先级 3（1月内）：加强出厂质检
  优先级 4（下批）：优化配件包装

六、竞品 VOC 对比
  对比 ASIN：B0YYYYYYY
  竞品优势：材质口碑更佳
  竞争劣势：价格偏高 15%
  差异化机会：同等材质 + 更低价格

输入 ASIN 或上传 Review CSV 即可开始分析。`);
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#f0f0f0]">VOC 深度分析</h1>
        <p className="text-sm text-[#a0a0a0] mt-1">12板块消费者洞察 · KANO模型分类 · 从Review挖出产品改进方向</p>
      </div>

      <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6 mb-6">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-[#a0a0a0] mb-2">ASIN</label>
            <input
              type="text" value={asin} onChange={(e) => setAsin(e.target.value)}
              placeholder="例如：B0XXXXXXX"
              className="w-full px-4 py-3 bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg text-[#f0f0f0] placeholder-[#666] focus:outline-none focus:border-[#ff9900]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#a0a0a0] mb-2">分析 Review 数量</label>
            <select value={reviewCount} onChange={(e) => setReviewCount(Number(e.target.value))}
              className="w-full px-4 py-3 bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg text-[#f0f0f0] focus:outline-none focus:border-[#ff9900]"
            >
              {[50, 100, 200, 500, 1000].map((n) => (
                <option key={n} value={n}>最新 {n} 条</option>
              ))}
            </select>
          </div>
        </div>
        <button onClick={handleAnalyze} disabled={loading || !asin.trim()}
          className="w-full py-3 bg-[#ff9900] text-black font-semibold rounded-lg hover:bg-[#e68a00] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          {loading ? "分析中..." : "开始 VOC 分析"}
        </button>
      </div>

      {result && (
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
          <h2 className="text-lg font-semibold text-[#f0f0f0] mb-4">VOC 分析报告</h2>
          <pre className="text-sm text-[#d0d0d0] leading-relaxed whitespace-pre-wrap font-mono bg-[#0f0f0f] rounded-lg p-5 max-h-[70vh] overflow-y-auto">{result}</pre>
        </div>
      )}
    </div>
  );
}
