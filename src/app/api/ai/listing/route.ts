// Listing 全案 API
// POST /api/ai/listing

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { step, asin, keyword } = await req.json();

    const aiKey = process.env.DEEPSEEK_API_KEY || process.env.GEMINI_API_KEY || process.env.CLAUDE_API_KEY;
    if (!aiKey) {
      return NextResponse.json({ content: null, message: "AI API Key 未配置" });
    }

    // 先搜数据
    const { webSearch, searchAmazonASIN } = await import("@/lib/search");
    const searchTarget = asin || keyword || "";
    const realData = asin
      ? await searchAmazonASIN(asin)
      : await webSearch(`amazon "${searchTarget}" product listing analysis review`);

    const { callAI } = await import("@/lib/ai");
    const preferredModel = process.env.GEMINI_API_KEY ? "gemini" : process.env.DEEPSEEK_API_KEY ? "deepseek" : "claude";

    const stepPrompts: Record<number, string> = {
      1: `基于搜索数据分析此ASIN的市场表现。从商品页提取标题/价格/评分/BSR/评论数；从评论搜索提取用户反馈。搜索数据不足时用行业知识补充，标注来源。`,
      2: `用 COSMO+VOC+关键词三源融合法生成Listing：标题、五点、描述、Search Terms。基于商品信息和竞品做差异化。`,
      3: `规划7张主图+A+排版。每张类型、内容、AI生图提示词。基于产品特征。`,
      4: `生成AI生图提示词，标注可用/需后期。`,
      5: `生成关键词矩阵：根词+长尾+否词。`,
      6: `整理以上5步，汇总文档。`,
    };

    const response = await callAI({
      model: preferredModel as "deepseek" | "gemini" | "claude",
      systemPrompt: "亚马逊运营专家。基于搜索数据+行业知识分析，标注来源。数据不足时用经验补充。",
      userPrompt: `Step ${step}：${stepPrompts[step] || stepPrompts[1]}\n\nASIN: ${asin || "无"}\n关键词: ${keyword || "无"}\n\n=== 实时搜索数据 ===\n${realData || "无搜索结果"}\n=== 请完成 Step ${step} ===`,
    });

    return NextResponse.json({ content: response.text, step, model: response.model });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
