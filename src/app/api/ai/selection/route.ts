// 选品分析 API
// POST /api/ai/selection

import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    const { method, input, marketplace } = await req.json();
    if (!input?.trim()) return NextResponse.json({ error: "请输入关键词或ASIN" }, { status: 400 });

    const aiKey = process.env.DEEPSEEK_API_KEY || process.env.GEMINI_API_KEY || process.env.CLAUDE_API_KEY;
    if (!aiKey) return NextResponse.json({ report: null, message: "AI API Key 未配置。" });

    // 并行搜索
    const { searchAmazonKeyword, searchAmazonASIN, webSearch } = await import("@/lib/search");
    const searchPromises = method === "asin"
      ? [searchAmazonASIN(input)]
      : [searchAmazonKeyword(input), webSearch(`amazon best ${input} product`)];
    const startTime = Date.now();
    const searchResults = await Promise.all(searchPromises);
    const realData = (searchResults.filter(Boolean).join("\n") || "无搜索结果").substring(0, 4000);
    const searchMs = Date.now() - startTime;

    // 调用 AI（加 try/catch 捕获错误）
    let reportText = "";
    let modelUsed = "";
    let usage = { promptTokens: 0, completionTokens: 0 };

    try {
      const { callAI } = await import("@/lib/ai");
      const preferredModel = process.env.GEMINI_API_KEY ? "gemini" : process.env.DEEPSEEK_API_KEY ? "deepseek" : "claude";
      const response = await callAI({
        model: preferredModel as "deepseek" | "gemini" | "claude",
        maxTokens: 4096,
        systemPrompt: "你是亚马逊选品专家。基于数据+知识给出分析，标注数据来源。",
        userPrompt: `${method}: ${input} (${marketplace || "US"})\n\n===搜索数据===\n${realData}\n\n请生成报告：1市场概况 2竞争格局 3关键词 4利润 5差异化 6建议`,
      });
      reportText = response.text;
      modelUsed = response.model;
      usage = response.usage;
    } catch (aiError) {
      reportText = `AI调用失败: ${aiError}`;
    }

    if (!reportText) {
      reportText = `AI未返回内容。Token: ${usage.promptTokens}+${usage.completionTokens}。搜索(${searchMs}ms):\n${realData}`;
    }

    return NextResponse.json({
      report: reportText,
      model: modelUsed,
      dataSource: `搜索(${searchMs}ms) + ${modelUsed}`,
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
