// 联网搜索工具 —— 拉取真实数据喂给 AI
// 所有超时 3 秒，适配 Vercel Hobby 10s 限制

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
  // 直接抓 Amazon 商品页 + Bing 搜评论
  const [direct, reviews] = await Promise.all([
    fetchAmazonProduct(asin),
    webSearch(`"${asin}" amazon review rating`),
  ]);
  const r = [direct, reviews].filter(Boolean).join("\n");
  return r || `（未搜到 ASIN ${asin} 数据）`;
}

export async function search1688Supplier(name: string): Promise<string> {
  const r = await webSearch(`1688 ${name} 批发 MOQ`);
  return r || `（未搜到 "${name}" 供应商数据）`;
}

// === impl ===

/** 直接抓取 Amazon 商品页获取标题/价格/评分 */
async function fetchAmazonProduct(asin: string): Promise<string> {
  try {
    const res = await fetch(`https://www.amazon.com/dp/${asin}`, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
      },
      signal: AbortSignal.timeout(TO),
    });
    if (!res.ok) return "";
    const html = await res.text();

    // 提取标题
    const titleMatch = html.match(/<span[^>]*id="productTitle"[^>]*>([^<]+)</);
    const title = titleMatch?.[1]?.trim() || "";

    // 提取评分
    const ratingMatch = html.match(/(\d\.\d) out of 5 stars/);
    const rating = ratingMatch?.[1] || "";

    // 提取评论数
    const reviewMatch = html.match(/([\d,]+) ratings/);
    const reviews = reviewMatch?.[1] || "";

    // 提取价格
    const priceMatch = html.match(/\$([\d.]+)/);
    const price = priceMatch?.[0] || "";

    // 提取 BSR
    const bsrMatch = html.match(/Best Sellers Rank[^#]*#([\d,]+)/);
    const bsr = bsrMatch?.[1] || "";

    const parts = [];
    if (title) parts.push(`商品标题: ${title}`);
    if (rating) parts.push(`评分: ${rating} 星`);
    if (reviews) parts.push(`评论数: ${reviews}`);
    if (price) parts.push(`售价: ${price}`);
    if (bsr) parts.push(`BSR: #${bsr}`);

    return parts.length > 0 ? `Amazon商品页数据:\n${parts.join("\n")}` : "";
  } catch {
    return "";
  }
}

async function braveSearch(q: string): Promise<string> {
  try {
    const res = await fetch(`https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(q)}&count=3`, {
      headers: { "Accept": "application/json", "Accept-Encoding": "gzip", "X-Subscription-Token": process.env.BRAVE_API_KEY! },
      signal: AbortSignal.timeout(TO),
    });
    if (!res.ok) return "";
    const d = await res.json() as { web?: { results?: { title: string; description: string; url: string }[] } };
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
