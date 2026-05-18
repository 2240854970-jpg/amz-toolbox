// 上架策略 API
// POST /api/ai/strategy

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { asin } = await req.json();
    if (!asin?.trim()) {
      return NextResponse.json({ error: "请输入ASIN" }, { status: 400 });
    }

    const aiKey = process.env.DEEPSEEK_API_KEY || process.env.GEMINI_API_KEY || process.env.CLAUDE_API_KEY;
    if (!aiKey) {
      return NextResponse.json({ strategy: null, message: "AI API Key 未配置" });
    }

    // 先搜竞品数据
    const { searchAmazonASIN, webSearch } = await import("@/lib/search");
    const realData = `${await searchAmazonASIN(asin)}\n\n${await webSearch(`amazon "${asin}" competitor pricing strategy`)}`;

    const { callAI } = await import("@/lib/ai");
    const preferredModel = process.env.GEMINI_API_KEY ? "gemini" : process.env.DEEPSEEK_API_KEY ? "deepseek" : "claude";

    const response = await callAI({
      model: preferredModel as "deepseek" | "gemini" | "claude",
      systemPrompt: `你是亚马逊新品上架策略专家。只能基于搜索数据生成策略。禁止编造数字。`,
      userPrompt: `竞品 ASIN：${asin}\n\n=== 实时搜索数据 ===\n${realData || "无搜索结果"}\n=== 请生成：定价策略（锚定竞品中位价，冷启动低于85%）+ STAG广告架构 + 20周阶梯预测 ===`,
    });

    return NextResponse.json({ strategy: response.text, model: response.model });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
