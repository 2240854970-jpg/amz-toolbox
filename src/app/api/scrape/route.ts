// Amazon 商品页抓取 API
import { NextRequest, NextResponse } from "next/server";
import { scrapeAmazonProduct } from "@/lib/scrape-amazon";

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  const { url } = await req.json().catch(() => ({}));
  if (!url) return NextResponse.json({ error: "请提供 url" }, { status: 400 });

  const data = await scrapeAmazonProduct(url);
  if (!data) return NextResponse.json({ error: "抓取失败" }, { status: 404 });

  return NextResponse.json(data);
}
