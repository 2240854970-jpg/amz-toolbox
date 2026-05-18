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
      1: `你是亚马逊数据分析师。基于搜索数据，分析产品市场表现：月销量预估、BSR、评论、竞品关键参数。`,
      2: `你是亚马逊 Listing 文案专家。用 COSMO + VOC + 关键词三源融合法生成：标题、五点描述、长描述、Search Terms。基于搜索数据中的竞品信息做差异化。`,
      3: `你是电商视觉策略师。规划7张主图+A+排版：每张图的类型、内容描述、AI生图提示词。基于搜索数据中的产品特征。`,
      4: `你是AI图像工程师。根据图片策略生成精准的AI生图提示词。标注可用/需后期。`,
      5: `你是亚马逊广告策略师。生成关键词矩阵：根词、长尾词、否词。基于搜索数据。`,
      6: `整理以上5步结果，生成汇总文档。`,
    };

    const response = await callAI({
      model: preferredModel as "deepseek" | "gemini" | "claude",
      systemPrompt: `你是亚马逊运营全案专家，有10年Listing优化经验。只能基于搜索数据作答，禁止编造数字。`,
      userPrompt: `Step ${step}：${stepPrompts[step] || stepPrompts[1]}\n\nASIN: ${asin || "无"}\n关键词: ${keyword || "无"}\n\n=== 实时搜索数据 ===\n${realData || "无搜索结果"}\n=== 请完成 Step ${step} ===`,
    });

    return NextResponse.json({ content: response.text, step, model: response.model });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
