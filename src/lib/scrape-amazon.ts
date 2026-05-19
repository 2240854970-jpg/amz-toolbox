// Amazon 抓取（Puppeteer + @sparticuz/chromium，Vercel 兼容）

import Chromium from "@sparticuz/chromium";

export async function scrapeAmazonProduct(urlOrAsin: string): Promise<{
  title: string; rating: string; reviews: string; price: string; bsr: string;
  bulletPoints: string[]; description: string; category: string;
} | null> {
  const url = urlOrAsin.startsWith("http") ? urlOrAsin : `https://www.amazon.com/dp/${urlOrAsin}`;

  let browser;
  try {
    const puppeteer = await import("puppeteer-core");

    browser = await puppeteer.launch({
      args: Chromium.args,
      executablePath: await Chromium.executablePath(),
      headless: true,
    });

    const page = await browser.newPage();
    await page.setExtraHTTPHeaders({ "Accept-Language": "en-US,en;q=0.9" });
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 12000 });
    await page.waitForSelector("#productTitle", { timeout: 8000 }).catch(() => {});

    const data = await page.evaluate(() => {
      const t = (s: string) => document.querySelector(s)?.textContent?.trim() || "";
      const ratingText = t("#acrPopover") || t('[data-hook="rating-out-of-text"]');
      const rating = ratingText.match(/(\d+\.?\d*)/)?.[1] || "";
      const reviews = (t("#acrCustomerReviewText").match(/([\d,]+)/) || [])[1]?.replace(/,/g, "") || "";
      const whole = t(".a-price-whole")?.replace(/[.,]/g, "");
      const frac = t(".a-price-fraction");
      const price = whole ? `$${whole}${frac ? "." + frac : ""}` : "";
      let bsr = "";
      document.querySelectorAll("tr, .prodDetTable tr").forEach((row) => {
        if (row.textContent?.includes("Best Sellers Rank")) {
          const m = row.textContent.match(/#([\d,]+)/);
          if (m) bsr = m[1].replace(/,/g, "");
        }
      });
      const bullets = Array.from(document.querySelectorAll("#feature-bullets li span"))
        .map((s) => s.textContent?.trim()).filter(Boolean).slice(0, 5);
      const desc = (document.querySelector("#productDescription p")?.textContent || "").substring(0, 500);
      const catEl = document.querySelector("#wayfinding-breadcrumbs_feature_div ul");
      const category = catEl?.textContent?.trim()?.replace(/\s+/g, " > ") || "";
      return { title: t("#productTitle"), rating, reviews, price, bsr, bulletPoints: bullets, description: desc, category };
    });

    await browser.close();
    return data.title ? data : null;
  } catch {
    if (browser) await browser.close?.().catch(() => {});
    return null;
  }
}
