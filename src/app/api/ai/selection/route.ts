// 选品分析 API
// POST /api/ai/selection

import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    const { method, input, marketplace } = await req.json();
    if (!input?.trim()) return NextResponse.json({ error: "请输入关键词或ASIN" }, { status: 400 });

    // 并行搜索
    const { searchAmazonKeyword, searchAmazonASIN, webSearch } = await import("@/lib/search");
    const searchPromises = method === "asin"
      ? [searchAmazonASIN(input)]
      : [searchAmazonKeyword(input), webSearch(`amazon best ${input} product`)];
    const startTime = Date.now();
    const searchResults = await Promise.all(searchPromises);
    const realData = (searchResults.filter(Boolean).join("\n") || "无搜索结果").substring(0, 4000);
    const searchMs = Date.now() - startTime;

    // 按优先级尝试：Gemini → DeepSeek → Claude
    const { callAI } = await import("@/lib/ai");
    const modelOrder: string[] = [];
    if (process.env.GEMINI_API_KEY) modelOrder.push("gemini");
    if (process.env.DEEPSEEK_API_KEY) modelOrder.push("deepseek");
    if (process.env.CLAUDE_API_KEY) modelOrder.push("claude");

    let reportText = "";
    let modelUsed = "";
    let usage = { promptTokens: 0, completionTokens: 0 };
    let lastError = "";

    for (const m of modelOrder) {
      try {
        const response = await callAI({
          model: m as "gemini" | "deepseek" | "claude",
          maxTokens: 4096,
          systemPrompt: "亚马逊选品专家。基于数据+知识分析，标注来源。",
          userPrompt: `${method}: ${input} (${marketplace || "US"})\n\n===数据===\n${realData}\n\n生成报告：1市场概况 2竞争 3关键词 4利润 5差异化 6建议`,
        });
        reportText = response.text;
        modelUsed = response.model;
        usage = response.usage;
        if (reportText) break;
        lastError = `模型返回空内容`;
      } catch (e) {
        lastError = String(e);
      }
    }

    if (!reportText) {
      reportText = `所有模型调用失败。搜索(${searchMs}ms):\n${realData}\n\n错误: ${lastError}`;
    }

    return NextResponse.json({
      report: reportText,
      model: modelUsed,
      dataSource: `搜索(${searchMs}ms) + ${modelUsed || "无"}`,
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
