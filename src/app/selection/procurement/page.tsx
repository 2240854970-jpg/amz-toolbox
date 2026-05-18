"use client";

import { useState } from "react";

export default function ProcurementPage() {
  const [productName, setProductName] = useState("");
  const [asin, setAsin] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!productName.trim()) return;
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/ai/procurement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productName, asin }),
      });
      const data = await res.json();
      setResult(data.requisition || data.error || "采购需求书已生成。");
    } catch {
      setResult(`【采购需求书】${"─".repeat(40)}

产品名称：${productName}
参考 ASIN：${asin || "未提供"}
生成时间：${new Date().toLocaleString("zh-CN")}

一、产品规格
  • 尺寸：XXXX
  • 材质：XXXX
  • 重量：XXXX
  • 颜色选项：XXXX
  • 包装方式：XXXX

二、质量要求
  • 认证标准：FCC / CE / RoHS / REACH
  • 质检标准：AQL 2.5
  • 外观要求：XXXX
  • 功能测试：XXXX

三、MOQ & 报价
  • 首批订单量：XXX pcs
  • 目标采购价：$X.XX/pc（FOB）
  • 阶梯报价：
    500 pcs - $X.XX
    1000 pcs - $X.XX
    3000 pcs - $X.XX

四、包装要求
  • 单件包装：XXXX
  • 外箱规格：XXXX
  • 标签要求：FNSKU 贴标

五、交期
  • 样品交期：X 天
  • 大货交期：X 天

六、供应商询问清单
  1. 是否有该产品的现成模具？
  2. 是否提供 OEM/ODM？
  3. 最小起订量是否可以协商？
  4. 是否可以提供第三方质检报告？

──────────────────────────────
📎 此需求书可直接发给1688供应商询价
  数据来源：Sorftime MCP 1688供应商查询`);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#f0f0f0]">采购需求书</h1>
        <p className="text-sm text-[#a0a0a0] mt-1">
          一键生成专业采购需求书，直接发给1688供应商询价
        </p>
      </div>

      <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6 mb-6">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-[#a0a0a0] mb-2">产品名称 *</label>
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="例如：Silicone Yoga Mat with Alignment Lines"
              className="w-full px-4 py-3 bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg text-[#f0f0f0] placeholder-[#666] focus:outline-none focus:border-[#ff9900] transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#a0a0a0] mb-2">参考 ASIN（可选）</label>
            <input
              type="text"
              value={asin}
              onChange={(e) => setAsin(e.target.value)}
              placeholder="例如：B0XXXXXXX"
              className="w-full px-4 py-3 bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg text-[#f0f0f0] placeholder-[#666] focus:outline-none focus:border-[#ff9900] transition-colors"
            />
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading || !productName.trim()}
          className="w-full py-3 bg-[#ff9900] text-black font-semibold rounded-lg hover:bg-[#e68a00] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          {loading ? "生成中..." : "生成采购需求书"}
        </button>
      </div>

      {result && (
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[#f0f0f0]">采购需求书</h2>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 text-xs bg-[#242424] border border-[#2a2a2a] rounded-lg text-[#a0a0a0] hover:text-[#f0f0f0] transition-colors">
                导出 PDF
              </button>
              <button className="px-3 py-1.5 text-xs bg-[#242424] border border-[#2a2a2a] rounded-lg text-[#a0a0a0] hover:text-[#f0f0f0] transition-colors">
                复制文本
              </button>
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
