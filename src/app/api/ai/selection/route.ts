// 选品分析 API
// POST /api/ai/selection

import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 30; // Vercel Pro/Hobby max

export async function POST(req: NextRequest) {
  try {
    const { method, input, marketplace } = await req.json();
    if (!input?.trim()) return NextResponse.json({ error: "请输入关键词或ASIN" }, { status: 400 });

    const aiKey = process.env.DEEPSEEK_API_KEY || process.env.GEMINI_API_KEY || process.env.CLAUDE_API_KEY;
    if (!aiKey) return NextResponse.json({ report: null, message: "AI API Key 未配置。" });

    // 并行搜索（2 个请求同时发）
    const { searchAmazonKeyword, searchAmazonASIN, webSearch } = await import("@/lib/search");
    const searchPromises = method === "asin"
      ? [searchAmazonASIN(input)]
      : [searchAmazonKeyword(input), webSearch(`amazon.com best ${input} product`)];

    const startTime = Date.now();
    const searchResults = await Promise.all(searchPromises);
    const realData = searchResults.filter(Boolean).join("\n\n");
    const searchMs = Date.now() - startTime;

    // AI 分析
    const { callAI } = await import("@/lib/ai");
    const preferredModel = process.env.DEEPSEEK_API_KEY ? "deepseek" : process.env.GEMINI_API_KEY ? "gemini" : "claude";

    const response = await callAI({
      model: preferredModel as "deepseek" | "gemini" | "claude",
      systemPrompt: `你是亚马逊选品专家。请基于搜索数据分析，数据不足时用你的亚马逊知识补充，标注"基于经验"。
报告框架：1.市场概况 2.竞争格局 3.关键词矩阵 4.利润测算 5.差异化空间 6.综合建议`,
      userPrompt: `选品：${method} | ${input} | 站点：${marketplace || "US"}\n\n=== 实时数据 ===\n${realData || "（搜索无结果，请基于你的亚马逊知识给出定性分析）"}\n=== 请生成完整选品报告（市场概况、竞争格局、关键词、利润、差异化、建议） ===`,
    });

    const reportText = response.text || `（AI 未生成报告，请查看原始搜索数据）\n\n=== 搜索数据 ===\n${realData || "无"}`;

    return NextResponse.json({
      report: reportText,
      model: response.model,
      dataSource: `联网搜索(${searchMs}ms) + ${response.model}`,
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
