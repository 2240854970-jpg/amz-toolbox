// 选品分析 API
// POST /api/ai/selection
// 先联网搜索真实数据，再调用 AI 生成 11 板块报告

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { method, input, marketplace } = await req.json();

    if (!input?.trim()) {
      return NextResponse.json({ error: "请输入关键词或ASIN" }, { status: 400 });
    }

    const aiKey = process.env.DEEPSEEK_API_KEY || process.env.GEMINI_API_KEY || process.env.CLAUDE_API_KEY;
    if (!aiKey) {
      return NextResponse.json({
        report: null,
        message: "AI API Key 未配置。",
      });
    }

    // ═══════════════════════════════
    // 第一步：联网搜索真实数据
    // ═══════════════════════════════
    const { searchAmazonKeyword, searchAmazonASIN, webSearch } = await import("@/lib/search");

    let realData = "";
    if (method === "asin") {
      realData = await searchAmazonASIN(input);
    } else {
      // keyword / category / competitor / trend 都用关键词搜索
      realData = `${await searchAmazonKeyword(input)}\n\n${await webSearch(`${input} amazon.com top sellers best price`)}`;
    }

    // ═══════════════════════════════
    // 第二步：把真实数据 + 分析框架 一起喂给 AI
    // ═══════════════════════════════
    const { callAI } = await import("@/lib/ai");
    const preferredModel = process.env.DEEPSEEK_API_KEY ? "deepseek" : process.env.GEMINI_API_KEY ? "gemini" : "claude";

    const response = await callAI({
      model: preferredModel as "deepseek" | "gemini" | "claude",
      systemPrompt: `你是亚马逊选品专家，有10年跨境电商经验。

⚠️ 重要规则：
- 你只能基于下方「实时搜索数据」做分析，禁止编造任何数字
- 每条结论必须引用搜索数据中的具体信息
- 如果搜索数据不足以支撑某个板块，明确标注"数据不足，建议用专业工具（Sorftime/Helium10）核实"
- 不要写"根据经验估计"、"据统计"这类模糊表述

请按以下框架生成选品分析报告：
1. 市场概况（市场规模、月销量、均价、季节性、增长趋势）
2. 竞争格局（品牌集中度、新品机会、评论门槛）
3. 关键词矩阵（核心词+长尾词+CPC+搜索量）
4. 利润测算（FBA费+佣金+采购+物流+毛利率）
5. 差异化空间（痛点、功能缺口、价格缺口）
6. 综合建议与风险提示`,
      userPrompt: `选品方法：${method}\n输入：${input}\n站点：${marketplace || "US"}\n\n=== 实时搜索数据（必须基于此数据作答） ===\n${realData || "（未获取到搜索结果）"}\n=== 请生成完整选品分析报告 ===`,
    });

    return NextResponse.json({
      report: response.text,
      model: response.model,
      dataSource: "联网搜索 + " + response.model,
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
