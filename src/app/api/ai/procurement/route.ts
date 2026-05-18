// 采购需求书 API
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { productName, asin } = await req.json();
    if (!productName?.trim()) return NextResponse.json({ error: "请输入产品名称" }, { status: 400 });

    const { search1688Supplier, webSearch } = await import("@/lib/search");
    const realData = (await Promise.all([search1688Supplier(productName), webSearch(`${productName} factory OEM`)])).filter(Boolean).join("\n");

    const { callAI } = await import("@/lib/ai");
    const modelOrder: string[] = [];
    if (process.env.GEMINI_API_KEY) modelOrder.push("gemini");
    if (process.env.DEEPSEEK_API_KEY) modelOrder.push("deepseek");
    if (process.env.CLAUDE_API_KEY) modelOrder.push("claude");
    if (!modelOrder.length) return NextResponse.json({ requisition: null, message: "AI API Key 未配置" });

    let text = ""; let modelUsed = "";
    for (const m of modelOrder) {
      try {
        const r = await callAI({ model: m as any, systemPrompt: "采购专家。生成专业采购需求书。", userPrompt: `产品：${productName}\nASIN：${asin || "无"}\n===数据===\n${realData}\n===生成：规格、质量、MOQ报价、包装、交期、供应商问询===` });
        text = r.text; modelUsed = r.model; if (text) break;
      } catch {}
    }
    return NextResponse.json({ requisition: text || "调用失败", model: modelUsed });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
