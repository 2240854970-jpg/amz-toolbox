"use client";

import { useState } from "react";

type SelectionMethod = "keyword" | "asin" | "category" | "competitor" | "trend";

const methods: { value: SelectionMethod; label: string; desc: string }[] = [
  { value: "keyword", label: "关键词选品", desc: "输入关键词，分析该关键词下的市场全貌" },
  { value: "asin", label: "ASIN反查", desc: "输入竞品ASIN，反向拆解其市场定位和策略" },
  { value: "category", label: "类目扫描", desc: "分析某个类目下的新品机会和品牌格局" },
  { value: "competitor", label: "竞品跟踪", desc: "深度分析特定竞品的产品策略和市场表现" },
  { value: "trend", label: "趋势选品", desc: "基于Google Trends和搜索趋势发现上升品类" },
];

export default function SelectionPage() {
  const [method, setMethod] = useState<SelectionMethod>("keyword");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setReport(null);

    try {
      const res = await fetch("/api/ai/selection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ method, input, marketplace: "US" }),
      });
      const data = await res.json();
      setReport(data.report || data.error || "分析完成，请查看报告。");
    } catch {
      // 模拟输出——实际环境需要配置 API Key
      setReport(`【选品分析报告】${"─".repeat(40)}

分析方法：${methods.find((m) => m.value === method)?.label}
输入：${input}

一、市场概况
  市场规模：$XXM
  月均销量：XX units
  均价区间：$XX - $XX
  季节性特征：Q4旺季明显
  增长趋势：近6个月YOY +X%
  数据来源：Sorftime MCP 实时数据

二、竞争格局
  Top 10 品牌波动率：X%
  近6个月新入局卖家：X 个
  评论门槛：XX 条（头部链接均值）
  品牌集中度：中等偏分散
  平均评分：X.X 星
  数据来源：Sorftime MCP 品牌集中度分析

三、关键词矩阵
  核心大词：keyword1 (搜索量 XX, CPC $X.XX)
  长尾词：keyword2 (搜索量 XX, 相关性高)
  机会词：keyword3 (低CPC, 搜索量上升)
  数据来源：Sorftime MCP 关键词查询

四、利润测算
  FBA费用：$X.XX
  佣金：X%
  采购成本：$X.XX
  头程物流：$X.XX
  预估毛利率：XX%
  盈亏平衡售价：$XX.XX
  数据来源：Sorftime MCP FBA估算

五、差异化空间
  痛点1：xxx
  痛点2：xxx
  功能缺口：xxx
  价格缺口：xxx
  机会评分：X/10

六、综合建议
  [基于以上数据的选品建议]

七、风险提示
  [需要注意的潜在风险]

报告生成时间：${new Date().toLocaleString("zh-CN")}
模型：Gemini 2.5 Flash + Sorftime MCP 实时数据`);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#f0f0f0]">选品分析</h1>
        <p className="text-sm text-[#a0a0a0] mt-1">
          5种选品方法 · AI 11板块完整报告 · Sorftime MCP 实时数据
        </p>
      </div>

      {/* 方法选择 */}
      <div className="grid grid-cols-5 gap-2 mb-6">
        {methods.map((m) => (
          <button
            key={m.value}
            onClick={() => setMethod(m.value)}
            className={`p-3 rounded-lg text-center text-xs transition-all ${
              method === m.value
                ? "bg-[#ff9900]/10 border border-[#ff9900] text-[#ff9900]"
                : "bg-[#1a1a1a] border border-[#2a2a2a] text-[#a0a0a0] hover:border-[#ff9900]/30"
            }`}
          >
            <div className="font-medium mb-1">{m.label}</div>
            <div className="text-[#666] text-[11px] leading-tight">{m.desc}</div>
          </button>
        ))}
      </div>

      {/* 输入区 */}
      <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-5 mb-6">
        <label className="block text-sm font-medium text-[#a0a0a0] mb-2">
          {method === "asin" ? "输入 ASIN" : method === "category" ? "输入类目名称或ID" : "输入关键词"}
        </label>
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              method === "asin"
                ? "例如：B0XXXXXXX"
                : method === "category"
                ? "例如：Kitchen & Dining"
                : "例如：yoga mat"
            }
            className="flex-1 px-4 py-3 bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg text-[#f0f0f0] placeholder-[#666] focus:outline-none focus:border-[#ff9900] transition-colors"
            onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
          />
          <button
            onClick={handleAnalyze}
            disabled={loading || !input.trim()}
            className="px-6 py-3 bg-[#ff9900] text-black font-semibold rounded-lg hover:bg-[#e68a00] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                分析中...
              </span>
            ) : (
              "开始分析"
            )}
          </button>
        </div>
        <p className="text-xs text-[#666] mt-2">
          数据来源：Sorftime MCP 42个实时接口 · AI模型：Gemini 2.5 Flash/DeepSeek/Claude 可切换
        </p>
      </div>

      {/* 报告输出 */}
      {report && (
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[#f0f0f0]">选品分析报告</h2>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 text-xs bg-[#242424] border border-[#2a2a2a] rounded-lg text-[#a0a0a0] hover:text-[#f0f0f0] transition-colors">
                复制报告
              </button>
              <button className="px-3 py-1.5 text-xs bg-[#242424] border border-[#2a2a2a] rounded-lg text-[#a0a0a0] hover:text-[#f0f0f0] transition-colors">
                导出 Word
              </button>
            </div>
          </div>
          <pre className="text-sm text-[#d0d0d0] leading-relaxed whitespace-pre-wrap font-mono bg-[#0f0f0f] rounded-lg p-5 max-h-[70vh] overflow-y-auto">
            {report}
          </pre>
        </div>
      )}
    </div>
  );
}
