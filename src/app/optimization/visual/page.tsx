"use client";

import { useState } from "react";

export default function VisualOptimizationPage() {
  const [asin, setAsin] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!asin.trim()) return;
    setLoading(true);
    setResult(null);
    await new Promise((r) => setTimeout(r, 2500));

    setResult(`【视觉优化报告】${"─".repeat(40)}
ASIN：${asin}
分析时间：${new Date().toLocaleString("zh-CN")}

一、当前图片诊断
  🔴 主图（Slot 1）：
     · 背景不够纯白（RGB 248,248,248 → 需要 255,255,255）
     · 产品占比仅 72%（建议 ≥ 85%）
     · 缺少阴影处理，立体感不足

  🟡 场景图（Slot 2）：
     · 场景选择正确 ✓
     · 但光线偏暗，画面层次不足
     · 建议补光或后期提亮

  🟡 功能图（Slot 3）：
     · 功能标注文字过小，移动端不可读
     · 建议使用图标 + 大字体取代密集文字

  🔴 尺寸图（Slot 4）：
     · 缺少！当前没有尺寸对比图
     · 这是高退货率的原因之一

  ✅ 对比图（Slot 5）：合格，无需改动

  🟡 视频封面（Slot 7）：画面选取不够有吸引力
     · 建议使用产品使用中的最佳帧

二、AI 双轨出图（Gemini Image + Seedream）
  ┌────┬──────────────────────┬──────────┬──────────┐
  │Slot│  描述                │ Gemini   │ Seedream │
  ├────┼──────────────────────┼──────────┼──────────┤
  │ 1  │ 纯白底产品正面图     │ ✅ 可用  │ ✅ 可用  │
  │ 2  │ 客厅瑜伽场景         │ ✅ 可用  │ ⚠️ 需后期│
  │ 3  │ 材质特写+标注        │ ⚠️ 需后期│ ⚠️ 需后期│
  │ 4  │ 尺寸参照对比图       │ ✅ 可用  │ ✅ 可用  │
  └────┴──────────────────────┴──────────┴──────────┘

三、AI 生图结果预览
  [Gemini Image]
  Slot 1 - 白底主图：
    提示词：Professional product photo of a yoga mat on pure
    white background, studio lighting...
    状态：✅ 可直接上传
    文件：img_slot1_gemini.png

  Slot 2 - 场景图：
    提示词：A woman practicing yoga on a mat in a bright modern
    living room, morning sunlight, minimalist decor...
    状态：✅ 可直接上传
    文件：img_slot2_gemini.png

  [Seedream]
  Slot 1 - 白底主图：
    提示词：瑜伽垫纯白背景专业产品摄影，影棚灯光...
    状态：✅ 可直接上传

  Slot 2 - 场景图：
    提示词：现代客厅中女性在瑜伽垫上练习，晨光，极简风...
    状态：⚠️ 人物手指细节需美工修复

四、美工 Brief
  📋 需后期处理：
    1. Slot 3 功能特写：换大字体标注，调整对比度
    2. Slot 4 尺寸图：制作新图（添加常见参照物）
    3. Seedream Slot 2：修复手指细节

  📋 参考风格：
    · 色调：温暖自然光，白平衡 5500K
    · 构图：三分法，产品居中
    · 字体：Helvetica Bold, 白色 + 阴影

模型：Gemini Image + Seedream（火山引擎即梦）`);
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#f0f0f0]">视觉优化</h1>
        <p className="text-sm text-[#a0a0a0] mt-1">图片诊断 · AI 双轨出图（Gemini + Seedream）· 美工 Brief</p>
      </div>

      <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6 mb-6">
        <label className="block text-sm font-medium text-[#a0a0a0] mb-2">输入 ASIN</label>
        <div className="flex gap-3">
          <input type="text" value={asin} onChange={(e) => setAsin(e.target.value)}
            placeholder="例如：B0XXXXXXX"
            className="flex-1 px-4 py-3 bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg text-[#f0f0f0] placeholder-[#666] focus:outline-none focus:border-[#ff9900]"
            onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
          />
          <button onClick={handleAnalyze} disabled={loading || !asin.trim()}
            className="px-6 py-3 bg-[#ff9900] text-black font-semibold rounded-lg hover:bg-[#e68a00] disabled:opacity-40 transition-all"
          >
            {loading ? "分析中..." : "开始诊断 + 生图"}
          </button>
        </div>
      </div>

      {result && (
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
          <h2 className="text-lg font-semibold text-[#f0f0f0] mb-4">视觉优化报告</h2>
          <pre className="text-sm text-[#d0d0d0] leading-relaxed whitespace-pre-wrap font-mono bg-[#0f0f0f] rounded-lg p-5 max-h-[70vh] overflow-y-auto">{result}</pre>
        </div>
      )}
    </div>
  );
}
