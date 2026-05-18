// 联网搜索工具 —— 拉取真实数据喂给 AI
// 多重降级策略：Bing → DuckDuckGo → 返回空

/**
 * 通用联网搜索，返回文本摘要
 */
export async function webSearch(query: string): Promise<string> {
  // 方案1: Brave Search API (最可靠，免费 2000次/月)
  if (process.env.BRAVE_API_KEY) {
    return braveSearch(query);
  }
  // 方案2: 自建 SearXNG (本地 Docker，无限免费)
  if (process.env.SEARXNG_URL) {
    return searxngSearch(query);
  }
  // 方案3: Bing 搜索 (免费，国内可访问)
  const bingResult = await bingSearch(query);
  if (bingResult) return bingResult;

  // 方案4: DuckDuckGo (免费但产品搜索弱)
  return duckDuckGoAll(query);
}

/**
 * 专门搜亚马逊关键词的市场数据
 */
export async function searchAmazonKeyword(keyword: string): Promise<string> {
  const queries = [
    `site:amazon.com "${keyword}" best seller`,
    `"${keyword}" amazon review rating price`,
    `"${keyword}" amazon top rated`,
  ];
  const results = await Promise.all(queries.map((q) => webSearch(q)));
  const combined = results.filter(Boolean).join("\n\n");
  return combined || `（未搜到 "${keyword}" 的相关数据，建议换更具体的关键词）`;
}

/**
 * 专门搜 ASIN 信息
 */
export async function searchAmazonASIN(asin: string): Promise<string> {
  const queries = [
    `amazon ${asin} review`,
    `${asin} product details price`,
  ];
  const results = await Promise.all(queries.map((q) => webSearch(q)));
  return results.filter(Boolean).join("\n\n") || `（未搜到 ASIN ${asin} 的数据）`;
}

/**
 * 搜 1688 供应商信息
 */
export async function search1688Supplier(productName: string): Promise<string> {
  const queries = [
    `1688.com ${productName} 批发`,
    `"${productName}" 工厂 代工 MOQ`,
  ];
  const results = await Promise.all(queries.map((q) => webSearch(q)));
  return results.filter(Boolean).join("\n\n") || `（未搜到 "${productName}" 的1688供应商数据）`;
}

// ============ 底层搜索实现 ============
async function braveSearch(query: string): Promise<string> {
  const res = await fetch(
    `https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(query)}&count=5`,
    {
      headers: {
        "Accept": "application/json",
        "Accept-Encoding": "gzip",
        "X-Subscription-Token": process.env.BRAVE_API_KEY!,
      },
      signal: AbortSignal.timeout(8000),
    }
  );
  if (!res.ok) return "";
  const data = await res.json() as { web?: { results?: { title: string; description: string; url: string }[] } };
  if (!data.web?.results) return "";
  return data.web.results.map((r) => `${r.title}\n${r.description}\n来源: ${r.url}`).join("\n\n");
}

// ============ 自建 SearXNG ============
async function searxngSearch(query: string): Promise<string> {
  const res = await fetch(`${process.env.SEARXNG_URL}/search`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `q=${encodeURIComponent(query)}&format=json&categories=general`,
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) return "";
  const data = await res.json() as { results?: { title: string; content: string; url: string }[] };
  if (!data.results) return "";
  return data.results.slice(0, 5).map((r) => `${r.title}\n${r.content}\n来源: ${r.url}`).join("\n\n");
}

// ============ Bing 搜索 ============
async function bingSearch(query: string): Promise<string> {
  try {
    const urls = [
      `https://www.bing.com/search?q=${encodeURIComponent(query)}&count=10&setlang=en-us&cc=us`,
      `https://www.bing.com/search?q=${encodeURIComponent(query)}&count=10&setlang=en`,
    ];

    for (const url of urls) {
      const res = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
          "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
        },
        signal: AbortSignal.timeout(8000),
      });
      if (!res.ok) continue;

      const html = await res.text();
      // 提取搜索结果摘要
      const snippets: string[] = [];
      const patterns = [
        /<p[^>]*class="b_lineclamp[^"]*"[^>]*>([^<]+)<\/p>/g,
        /<p[^>]*>([^<]{30,300})<\/p>/g,
        /class="b_caption"[^>]*>[\s\S]*?<p[^>]*>([^<]{30,300})<\/p>/g,
      ];

      for (const pattern of patterns) {
        let match;
        while ((match = pattern.exec(html)) !== null && snippets.length < 5) {
          const text = match[1].replace(/<[^>]+>/g, "").trim();
          if (text.length > 30) snippets.push(text);
        }
        if (snippets.length >= 3) break;
      }

      if (snippets.length > 0) return snippets.join("\n\n");
    }
    return "";
  } catch {
    return "";
  }
}

// ============ DuckDuckGo 全尝试 ============
async function duckDuckGoAll(query: string): Promise<string> {
  try {
    // Instant Answer API
    const res1 = await fetch(
      `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1`,
      { signal: AbortSignal.timeout(5000) }
    );
    const data = await res1.json() as { Abstract?: string; RelatedTopics?: { Text?: string }[] };
    const parts: string[] = [];
    if (data.Abstract) parts.push(data.Abstract);
    if (data.RelatedTopics) {
      data.RelatedTopics.slice(0, 5).forEach((t) => { if (t.Text) parts.push(t.Text); });
    }
    if (parts.length > 0) return parts.join("\n\n");

    // HTML Lite 搜索
    const res2 = await fetch(
      `https://lite.duckduckgo.com/lite/?q=${encodeURIComponent(query)}`,
      {
        headers: { "User-Agent": "Mozilla/5.0" },
        signal: AbortSignal.timeout(8000),
      }
    );
    const html = await res2.text();
    const snippets = html.match(/<td[^>]*class="result-snippet"[^>]*>([^<]+)<\/td>/g);
    if (snippets) {
      return snippets.slice(0, 5).map((s) => s.replace(/<[^>]+>/g, "").trim()).join("\n\n");
    }

    return "";
  } catch {
    return "";
  }
}
