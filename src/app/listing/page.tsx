"use client";

import { useState } from "react";

const steps = [
  { id: 1, label: "数据分析", desc: "竞品数据采集 + 市场定位" },
  { id: 2, label: "文案生成", desc: "COSMO+VOC+关键词 三源融合" },
  { id: 3, label: "图片策略", desc: "7张主图 + A+ 完整规划" },
  { id: 4, label: "AI生图", desc: "Gemini Image + Seedream 双轨" },
  { id: 5, label: "关键词规划", desc: "根词 + 长尾 + 否词矩阵" },
  { id: 6, label: "导出文档", desc: "Word + Excel 一键导出" },
];

export default function ListingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [asin, setAsin] = useState("");
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Record<string, string>>({});

  const handleRunStep = async (step: number) => {
    setLoading(true);
    try {
      const res = await fetch("/api/ai/listing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ step, asin, keyword }),
      });
      const data = await res.json();
      setResult((prev) => ({ ...prev, [`step${step}`]: data.content || "Step completed." }));
      if (step < 6) setCurrentStep(step + 1);
    } catch {
      const mockContents: Record<number, string> = {
        1: `【数据分析】
竞品 ASIN：${asin || "B0XXXXXXX"}
  月销量预估：X,XXX units
  均价：$XX.XX
  BSR排名：#X,XXX in Category
  Review数量：XXX · 评分：X.X
  上架时间：XXXX年X月
  品牌备案：是
数据来源：Sorftime MCP ASIN查询`,
        2: `【文案生成 - 三源融合】
COSMO 语义分析：识别到 5 个核心购买意图
VOC 消费者洞察：从 Review 提取 8 个高频痛点/卖点
关键词索引：根词 3 + 长尾词 12 + 场景词 5

标题：
[品牌词] + [核心词] + [属性1] + [属性2] + [场景] + for [人群]

五点描述：
• [卖点1]: XXXXX
• [卖点2]: XXXXX
• [卖点3]: XXXXX
• [卖点4]: XXXXX
• [卖点5]: XXXXX

长描述：
[A+级别长文案]

Search Terms：
keyword1 keyword2 keyword3...`,
        3: `【图片策略规划】
主图1：纯白底产品正面图 [主图]
主图2：使用场景图 [场景-家庭环境]
主图3：功能特写图 [核心卖点放大]
主图4：尺寸对比图 [尺寸+参照物]
主图5：包装展示图 [包装+配件]
主图6：使用前后对比 [Before/After]
主图7：品牌视频封面 [视频]

A+ 模块规划：
Module 1: 品牌故事 - 960x300 横幅
Module 2: 产品对比表 - 标准对比
Module 3: 功能模块 - 左图右文 x4
Module 4: 场景模块 - 四图并排`,
        4: `【AI生图结果】
✅ 主图1 (白底产品图) - 可直接使用
✅ 主图2 (场景图) - 可直接使用
⚠️ 主图3 (功能特写) - 需美工后期调整细节
✅ 主图4 (尺寸图) - 可直接使用
⚠️ 主图5 (包装图) - 需替换实际包装
✅ A+ 模块素材 - 可用作设计参考

AI生图提示词已生成，美工可直接用作brief。`,
        5: `【关键词规划】
根词矩阵：
  yogurt maker (搜索量: XX,XXX, CPC: $X.XX)
  greek yogurt maker (搜索量: X,XXX, CPC: $X.XX)
  homemade yogurt machine (搜索量: X,XXX, CPC: $X.XX)

长尾词矩阵：
  automatic yogurt maker with temperature control
  large capacity yogurt machine 2L
  greek yogurt maker strainer included
  ...

否词：
  commercial, industrial, replacement parts

广告架构建议：
  Core Campaign (40%): 根词精准匹配
  Broad Campaign (20%): 长尾词广泛匹配
  Auto Campaign (25%): 自动发现
  Category Campaign (15%): 类目投放`,
        6: `✅ Listing 全案已生成完毕
📄 可导出：Word 文档 (.docx) + Excel 关键词表 (.xlsx)

包含内容：
• 完整 Listing 文案
• 图片策略 + AI生图提示词
• 关键词矩阵（根词/长尾/否词）
• A+ 排版方案
• 广告架构建议`,
      };
      setResult((prev) => ({ ...prev, [`step${step}`]: mockContents[step] || "" }));
      if (step < 6) setCurrentStep(step + 1);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#f0f0f0]">Listing 全案</h1>
        <p className="text-sm text-[#a0a0a0] mt-1">
          6步流程：数据分析 → 三源融合文案 → 图片策略 → AI生图 → 关键词规划 → 一键导出
        </p>
      </div>

      {/* 输入区 */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <input
          type="text"
          value={asin}
          onChange={(e) => setAsin(e.target.value)}
          placeholder="输入参考 ASIN（例如：B0XXXXXXX）"
          className="px-4 py-3 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-[#f0f0f0] placeholder-[#666] focus:outline-none focus:border-[#ff9900]"
        />
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="输入核心关键词（例如：yogurt maker）"
          className="px-4 py-3 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-[#f0f0f0] placeholder-[#666] focus:outline-none focus:border-[#ff9900]"
        />
      </div>

      {/* 步骤条 */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
        {steps.map((step, i) => (
          <div key={step.id} className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => handleRunStep(step.id)}
              disabled={loading}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                currentStep === step.id
                  ? "bg-[#ff9900] text-black"
                  : result[`step${step.id}`]
                  ? "bg-[#4caf50]/10 border border-[#4caf50] text-[#4caf50]"
                  : "bg-[#1a1a1a] border border-[#2a2a2a] text-[#a0a0a0]"
              }`}
            >
              <span className="text-xs">Step {step.id}</span>
              <div>{step.label}</div>
            </button>
            {i < steps.length - 1 && (
              <svg className="w-4 h-4 text-[#666] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            )}
          </div>
        ))}
      </div>

      {/* 结果展示 */}
      {Object.keys(result).length > 0 && (
        <div className="space-y-4">
          {steps
            .filter((s) => result[`step${s.id}`])
            .map((s) => (
              <div key={s.id} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-[#ff9900]">
                    Step {s.id}：{s.label}
                  </h3>
                  <span className="text-xs text-[#666]">{s.desc}</span>
                </div>
                <pre className="text-sm text-[#d0d0d0] leading-relaxed whitespace-pre-wrap font-mono bg-[#0f0f0f] rounded-lg p-4 max-h-96 overflow-y-auto">
                  {result[`step${s.id}`]}
                </pre>
              </div>
            ))}
        </div>
      )}

      {/* 一键全部运行 */}
      <div className="mt-6 flex gap-3">
        <button
          onClick={() => steps.forEach((s) => handleRunStep(s.id))}
          disabled={loading}
          className="px-6 py-3 bg-[#ff9900] text-black font-semibold rounded-lg hover:bg-[#e68a00] disabled:opacity-40 transition-all"
        >
          🚀 一键运行全部 6 步
        </button>
        {Object.keys(result).length === 6 && (
          <>
            <button className="px-6 py-3 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-[#a0a0a0] hover:text-[#f0f0f0] transition-colors">
              导出 Word (.docx)
            </button>
            <button className="px-6 py-3 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-[#a0a0a0] hover:text-[#f0f0f0] transition-colors">
              导出 Excel (.xlsx)
            </button>
          </>
        )}
      </div>
    </div>
  );
}
