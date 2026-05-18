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
      : [searchAmazonKeyword(input), webSearch(`site:amazon.com "${input}" review`)];

    const startTime = Date.now();
    const searchResults = await Promise.all(searchPromises);
    const realData = searchResults.filter(Boolean).join("\n\n");
    const searchMs = Date.now() - startTime;

    // AI 分析
    const { callAI } = await import("@/lib/ai");
    const preferredModel = process.env.DEEPSEEK_API_KEY ? "deepseek" : process.env.GEMINI_API_KEY ? "gemini" : "claude";

    const response = await callAI({
      model: preferredModel as "deepseek" | "gemini" | "claude",
      systemPrompt: `你是亚马逊选品专家。只能基于「实时搜索数据」分析，禁止编造数字。每条结论引用数据。数据不足时标注"需工具核实"。`,
      userPrompt: `选品：${method} | ${input} | 站点：${marketplace || "US"}\n\n=== 实时数据 ===\n${realData || "（搜索无结果，请基于你的亚马逊知识给出定性分析）"}\n=== 请生成完整选品报告（市场概况、竞争格局、关键词、利润、差异化、建议） ===`,
    });

    return NextResponse.json({
      report: response.text,
      model: response.model,
      dataSource: `联网搜索(${searchMs}ms) + ${response.model}`,
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
