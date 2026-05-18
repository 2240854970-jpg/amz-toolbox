// 上架策略 API
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { asin } = await req.json();
    if (!asin?.trim()) return NextResponse.json({ error: "请输入ASIN" }, { status: 400 });

    const { searchAmazonASIN, webSearch } = await import("@/lib/search");
    const realData = (await Promise.all([searchAmazonASIN(asin), webSearch(`amazon ${asin} competitor`)])).filter(Boolean).join("\n");

    const { callAI } = await import("@/lib/ai");
    const modelOrder: string[] = [];
    if (process.env.GEMINI_API_KEY) modelOrder.push("gemini");
    if (process.env.DEEPSEEK_API_KEY) modelOrder.push("deepseek");
    if (process.env.CLAUDE_API_KEY) modelOrder.push("claude");
    if (!modelOrder.length) return NextResponse.json({ strategy: null, message: "AI API Key 未配置" });

    let text = ""; let modelUsed = "";
    for (const m of modelOrder) {
      try {
        const r = await callAI({ model: m as any, systemPrompt: "上架策略专家。基于数据+经验分析。", userPrompt: `ASIN：${asin}\n===数据===\n${realData}\n===生成：定价策略(冷启动<中位价85%)+STAG架构+20周预测===` });
        text = r.text; modelUsed = r.model; if (text) break;
      } catch {}
    }
    return NextResponse.json({ strategy: text || "调用失败", model: modelUsed });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
