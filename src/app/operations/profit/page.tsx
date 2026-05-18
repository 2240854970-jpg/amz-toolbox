"use client";

import { useState } from "react";

interface SkuRow {
  sku: string;
  price: number;
  cogs: number;
  fbaFee: number;
  adSpend: number;
  unitsSold: number;
  returns: number;
}

export default function ProfitPage() {
  const [skus, setSkus] = useState<SkuRow[]>([
    { sku: "SKU-001", price: 29.99, cogs: 8.50, fbaFee: 5.40, adSpend: 120, unitsSold: 45, returns: 2 },
  ]);
  const [result, setResult] = useState<string | null>(null);

  const addSku = () => {
    setSkus([...skus, { sku: `SKU-${String(skus.length + 1).padStart(3, "0")}`, price: 0, cogs: 0, fbaFee: 0, adSpend: 0, unitsSold: 0, returns: 0 }]);
  };

  const updateSku = (idx: number, field: keyof SkuRow, value: string) => {
    const updated = [...skus];
    updated[idx] = { ...updated[idx], [field]: field === "sku" ? value : Number(value) };
    setSkus(updated);
  };

  const calculate = () => {
    const referralRate = 0.15;
    let totalRev = 0, totalFba = 0, totalRef = 0, totalCogs = 0, totalAd = 0, totalReturns = 0;

    const lines = skus.map((s) => {
      const rev = s.price * s.unitsSold;
      const fba = s.fbaFee * s.unitsSold;
      const ref = rev * referralRate;
      const cogsTotal = s.cogs * s.unitsSold;
      const returnLoss = s.returns * s.price * 0.5;
      const net = rev - fba - ref - cogsTotal - s.adSpend - returnLoss;
      const margin = rev > 0 ? (net / rev) * 100 : 0;
      totalRev += rev; totalFba += fba; totalRef += ref;
      totalCogs += cogsTotal; totalAd += s.adSpend; totalReturns += returnLoss;
      return { sku: s.sku, rev, fba, ref, cogs: cogsTotal, ad: s.adSpend, returns: returnLoss, net, margin };
    });

    const totalNet = lines.reduce((s, l) => s + l.net, 0);
    const totalMargin = totalRev > 0 ? (totalNet / totalRev) * 100 : 0;

    let report = `【利润核算】${"─".repeat(40)}\n\n`;
    report += `┌──────────┬──────────┬──────────┬──────────┬──────────┬──────────┬──────────┬──────────┬──────────┐\n`;
    report += `│ SKU      │ 收入     │ FBA费    │ 佣金     │ 采购成本  │ 广告费    │ 退货损失  │ 净利润    │ 利润率   │\n`;
    report += `├──────────┼──────────┼──────────┼──────────┼──────────┼──────────┼──────────┼──────────┼──────────┤\n`;
    lines.forEach((l) => {
      report += `│ ${l.sku.padEnd(8)} │ $${l.rev.toFixed(0).padStart(7)} │ $${l.fba.toFixed(0).padStart(7)} │ $${l.ref.toFixed(0).padStart(7)} │ $${l.cogs.toFixed(0).padStart(7)} │ $${l.ad.toFixed(0).padStart(7)} │ $${l.returns.toFixed(0).padStart(7)} │ $${l.net.toFixed(0).padStart(7)} │ ${l.margin.toFixed(1).padStart(6)}% │\n`;
    });
    report += `├──────────┼──────────┼──────────┼──────────┼──────────┼──────────┼──────────┼──────────┼──────────┤\n`;
    report += `│ 总计     │ $${totalRev.toFixed(0).padStart(7)} │ $${totalFba.toFixed(0).padStart(7)} │ $${totalRef.toFixed(0).padStart(7)} │ $${totalCogs.toFixed(0).padStart(7)} │ $${totalAd.toFixed(0).padStart(7)} │ $${totalReturns.toFixed(0).padStart(7)} │ $${totalNet.toFixed(0).padStart(7)} │ ${totalMargin.toFixed(1).padStart(6)}% │\n`;
    report += `└──────────┴──────────┴──────────┴──────────┴──────────┴──────────┴──────────┴──────────┴──────────┘\n\n`;
    report += `总营收：$${totalRev.toFixed(2)}\n`;
    report += `总净利润：$${totalNet.toFixed(2)}\n`;
    report += `总利润率：${totalMargin.toFixed(1)}%\n`;
    report += `\n数据来源：手动输入 / 后续可对接 Amazon SP-API 自动拉取`;

    setResult(report);
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#f0f0f0]">利润核算</h1>
        <p className="text-sm text-[#a0a0a0] mt-1">逐 SKU 拆解真实利润：收入、FBA、佣金、广告、采购、退货</p>
      </div>

      <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6 mb-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-[#a0a0a0] border-b border-[#2a2a2a]">
              <th className="text-left py-2 px-2">SKU</th>
              <th className="text-right py-2 px-2">售价</th>
              <th className="text-right py-2 px-2">采购成本</th>
              <th className="text-right py-2 px-2">FBA费</th>
              <th className="text-right py-2 px-2">广告费</th>
              <th className="text-right py-2 px-2">销量</th>
              <th className="text-right py-2 px-2">退货</th>
            </tr>
          </thead>
          <tbody>
            {skus.map((s, i) => (
              <tr key={i} className="border-b border-[#1a1a1a]">
                {(["sku", "price", "cogs", "fbaFee", "adSpend", "unitsSold", "returns"] as const).map((f) => (
                  <td key={f} className="py-2 px-2">
                    <input
                      type={f === "sku" ? "text" : "number"}
                      value={s[f]}
                      onChange={(e) => updateSku(i, f, e.target.value)}
                      className={`w-full px-2 py-1.5 bg-[#0f0f0f] border border-[#2a2a2a] rounded text-[#f0f0f0] text-sm ${f === "sku" ? "text-left" : "text-right"} focus:outline-none focus:border-[#ff9900]`}
                      step="any"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={addSku} className="mt-3 text-xs text-[#ff9900] hover:text-[#e68a00] transition-colors">+ 添加 SKU</button>
      </div>

      <button onClick={calculate} className="w-full py-3 bg-[#ff9900] text-black font-semibold rounded-lg hover:bg-[#e68a00] transition-all mb-6">
        计算利润
      </button>

      {result && (
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
          <h2 className="text-lg font-semibold text-[#f0f0f0] mb-4">利润核算结果</h2>
          <pre className="text-sm text-[#d0d0d0] leading-relaxed whitespace-pre-wrap font-mono bg-[#0f0f0f] rounded-lg p-5 max-h-[70vh] overflow-y-auto">{result}</pre>
        </div>
      )}
    </div>
  );
}
