// 联网搜索 + Amazon 抓取

import { scrapeAmazonProduct } from "./scrape-amazon";

const TO = 3000;

export async function webSearch(query: string): Promise<string> {
  if (process.env.BRAVE_API_KEY) return braveSearch(query);
  if (process.env.SEARXNG_URL) return searxngSearch(query);
  const bing = await bingSearch(query);
  if (bing) return bing;
  return duckDuckGoAll(query);
}

export async function searchAmazonKeyword(keyword: string): Promise<string> {
  const results = await Promise.all([
    webSearch(`amazon.com best ${keyword}`),
    webSearch(`${keyword} amazon review price rating`),
  ]);
  const r = results.filter(Boolean).join("\n\n");
  return r || `（未搜到 "${keyword}" 数据）`;
}

export async function searchAmazonASIN(asin: string): Promise<string> {
  // Puppeteer 浏览器抓取 Amazon 商品页
  const data = await scrapeAmazonProduct(asin);
  if (data) {
    const parts = [`商品标题: ${data.title}`];
    if (data.rating) parts.push(`评分: ${data.rating} 星`);
    if (data.reviews) parts.push(`评论数: ${data.reviews}`);
    if (data.price) parts.push(`售价: ${data.price}`);
    if (data.bsr) parts.push(`BSR: #${data.bsr}`);
    if (data.category) parts.push(`类目: ${data.category}`);
    if (data.bulletPoints.length) parts.push(`卖点:\n${data.bulletPoints.map(b => `  - ${b}`).join("\n")}`);
    if (data.description) parts.push(`描述: ${data.description}`);
    return `Amazon商品页数据:\n${parts.join("\n")}`;
  }
  const r = await webSearch(`https://www.amazon.com/dp/${asin}`);
  return r || `（未搜到 ASIN ${asin} 数据）`;
}

export async function search1688Supplier(name: string): Promise<string> {
  const r = await webSearch(`1688 ${name} 批发 MOQ`);
  return r || `（未搜到 "${name}" 供应商数据）`;
}

// === impl ===
async function braveSearch(q: string): Promise<string> {
  try {
    const res = await fetch(`https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(q)}&count=3`, {
      headers: { "Accept": "application/json", "X-Subscription-Token": process.env.BRAVE_API_KEY! },
      signal: AbortSignal.timeout(TO),
    });
    if (!res.ok) return "";
    const d = await res.json() as { web?: { results?: { title: string; description: string }[] } };
    return d.web?.results?.map(r => `${r.title}\n${r.description}`).join("\n\n") || "";
  } catch { return ""; }
}

async function searxngSearch(q: string): Promise<string> {
  try {
    const res = await fetch(`${process.env.SEARXNG_URL}/search`, {
      method: "POST", body: `q=${encodeURIComponent(q)}&format=json`, signal: AbortSignal.timeout(TO),
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
    if (!res.ok) return "";
    const d = await res.json() as { results?: { title: string; content: string }[] };
    return d.results?.slice(0, 3).map(r => `${r.title}\n${r.content}`).join("\n\n") || "";
  } catch { return ""; }
}

async function bingSearch(q: string): Promise<string> {
  try {
    const res = await fetch(`https://www.bing.com/search?q=${encodeURIComponent(q)}&setlang=en-us&cc=us`, {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" },
      signal: AbortSignal.timeout(TO),
    });
    if (!res.ok) return "";
    const html = await res.text();
    const re = /<p[^>]*>([^<]{40,300})<\/p>/g;
    const parts: string[] = []; let m;
    while ((m = re.exec(html)) !== null && parts.length < 3) parts.push(m[1].trim());
    return parts.join("\n\n");
  } catch { return ""; }
}

async function duckDuckGoAll(q: string): Promise<string> {
  try {
    const res = await fetch(`https://api.duckduckgo.com/?q=${encodeURIComponent(q)}&format=json&no_html=1`, { signal: AbortSignal.timeout(TO) });
    if (!res.ok) return "";
    const d = await res.json() as { Abstract?: string; RelatedTopics?: { Text?: string }[] };
    const parts = [d.Abstract, ...(d.RelatedTopics||[]).slice(0,3).map(t => t.Text)].filter(Boolean);
    return parts.join("\n\n");
  } catch { return ""; }
}
