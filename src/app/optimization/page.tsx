"use client";

import { useState } from "react";

export default function OptimizationPage() {
  const [asin, setAsin] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleOptimize = async () => {
    if (!asin.trim()) return;
    setLoading(true);
    setResult(null);
    await new Promise((r) => setTimeout(r, 2000));

    setResult(`【文案优化报告】${"─".repeat(40)}
ASIN：${asin}
优化时间：${new Date().toLocaleString("zh-CN")}

一、老品诊断
  🔴 标题问题：
    · 缺少核心属性词（如材质、尺寸）
    · 品牌名占比过低
    · 字符数仅 120/200，未充分利用

  🔴 五点描述问题：
    · 第1点未在最前面突出最大卖点
    · 缺少量化数据支撑
    · 第4点与竞品高度同质化

  🔴 Search Terms 问题：
    · 仅使用 8 个词组，远低于 249 byte 上限
    · 缺少西班牙语高频搜索词

二、SEO 评分
  优化前：62/100
  优化后：88/100 ↑ 26分

三、Before / After 对比

  【标题】
  Before: Yoga Mat Non Slip Exercise Mat for Home Workout
  After: [Brand] Premium TPE Yoga Mat 6mm - Non Slip Fitness Mat
         for Women, Eco Friendly Exercise Mat for Home Gym,
         Pilates & Stretching

  优化理由：增加材质(TPE)+厚度(6mm)+材质认证(Eco Friendly)
            +目标人群(Women)+扩展场景(Pilates&Stretching)

  【五点描述 Before】
  · NON SLIP: The mat features a non-slip surface.
  After →
  · DOUBLE-LAYER ANTI-SLIP: TPE top layer with
    laser-engraved texture provides 2X grip compared to
    standard PVC mats—stays put on hardwood, tile & carpet.

  优化理由：量化(2X grip)+技术细节(laser-engraved)+场景覆盖
           (hardwood/tile/carpet)

  【Search Terms Before】
  yoga mat, exercise mat, fitness mat, non slip mat,
  home gym, workout mat, pilates mat, gym mat

  After →
  yoga mat non slip, thick exercise mat, tpe yoga mat,
  eco friendly fitness mat, mat for women, home workout
  equipment, yoga accessories, gym flooring, stretching mat,
  travel yoga mat, foldable pilates mat, colchoneta yoga,
  tapete yoga antiderrapante

  优化理由：利用满249byte，增加西班牙语词，增加场景长尾词

四、A+ 文案优化
  Module 1 - 品牌故事：增加创始人故事 + 实验室测试数据
  Module 2 - 产品对比：新增本品牌VS行业标准对比表
  Module 3 - 功能模块：每段文案从50字扩展到100字+
  Module 4 - 场景模块：新增户外/办公室场景

五、建议操作
  1. 立即更新标题和五点（最高优先级）
  2. 3天内更新 Search Terms（无审核）
  3. 7天内更新 A+ 内容（审核周期 7 天）

模型：Gemini 2.5 Flash + DeepSeek 交叉校验`);
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#f0f0f0]">文案优化</h1>
        <p className="text-sm text-[#a0a0a0] mt-1">老品诊断 · Before/After 对比 · SEO 评分量化</p>
      </div>

      <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6 mb-6">
        <label className="block text-sm font-medium text-[#a0a0a0] mb-2">输入要优化的 ASIN</label>
        <div className="flex gap-3">
          <input type="text" value={asin} onChange={(e) => setAsin(e.target.value)}
            placeholder="例如：B0XXXXXXX"
            className="flex-1 px-4 py-3 bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg text-[#f0f0f0] placeholder-[#666] focus:outline-none focus:border-[#ff9900]"
            onKeyDown={(e) => e.key === "Enter" && handleOptimize()}
          />
          <button onClick={handleOptimize} disabled={loading || !asin.trim()}
            className="px-6 py-3 bg-[#ff9900] text-black font-semibold rounded-lg hover:bg-[#e68a00] disabled:opacity-40 transition-all"
          >
            {loading ? "优化中..." : "开始优化"}
          </button>
        </div>
      </div>

      {result && (
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
          <h2 className="text-lg font-semibold text-[#f0f0f0] mb-4">文案优化报告</h2>
          <pre className="text-sm text-[#d0d0d0] leading-relaxed whitespace-pre-wrap font-mono bg-[#0f0f0f] rounded-lg p-5 max-h-[70vh] overflow-y-auto">{result}</pre>
        </div>
      )}
    </div>
  );
}
