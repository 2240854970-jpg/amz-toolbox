// 采购需求书 API
// POST /api/ai/procurement

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { productName, asin } = await req.json();
    if (!productName?.trim()) {
      return NextResponse.json({ error: "请输入产品名称" }, { status: 400 });
    }

    const aiKey = process.env.DEEPSEEK_API_KEY || process.env.GEMINI_API_KEY || process.env.CLAUDE_API_KEY;
    if (!aiKey) {
      return NextResponse.json({ requisition: null, message: "AI API Key 未配置" });
    }

    // 先搜 1688 供应商数据
    const { search1688Supplier, webSearch } = await import("@/lib/search");
    const realData = `${await search1688Supplier(productName)}\n\n${await webSearch(`${productName} factory OEM MOQ price`)}`;

    const { callAI } = await import("@/lib/ai");
    const preferredModel = process.env.DEEPSEEK_API_KEY ? "deepseek" : process.env.GEMINI_API_KEY ? "gemini" : "claude";

    const response = await callAI({
      model: preferredModel as "deepseek" | "gemini" | "claude",
      systemPrompt: `你是亚马逊采购专家，擅长生成专业采购需求书。只能基于搜索数据作答，禁止编造。`,
      userPrompt: `产品名称：${productName}\n参考 ASIN：${asin || "无"}\n\n=== 实时搜索数据 ===\n${realData || "无搜索结果"}\n=== 请生成采购需求书：规格、质量要求、MOQ阶梯报价、包装要求、交期、供应商询问清单 ===`,
    });

    return NextResponse.json({ requisition: response.text, model: response.model });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
