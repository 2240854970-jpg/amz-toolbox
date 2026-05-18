// Sorftime MCP 客户端——42个实时数据接口
// 通过 MCP 协议连接 Sorftime 数据服务

const SORFTIME_MCP_ENDPOINT = process.env.SORFTIME_MCP_ENDPOINT || "";
const SORFTIME_API_KEY = process.env.SORFTIME_API_KEY || "";

interface MCPToolCall {
  name: string;
  arguments: Record<string, unknown>;
}

/**
 * 调用 Sorftime MCP 工具
 * 通过 MCP 协议发送 tool call 请求
 */
async function callMCPTool(tool: MCPToolCall): Promise<unknown> {
  if (!SORFTIME_MCP_ENDPOINT || !SORFTIME_API_KEY) {
    console.warn("Sorftime MCP not configured, returning mock data");
    return null;
  }

  const res = await fetch(SORFTIME_MCP_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${SORFTIME_API_KEY}`,
    },
    body: JSON.stringify(tool),
  });

  return res.json();
}

// ============ 选品相关接口 ============

/** 按关键词查询市场数据 */
export async function queryMarketByKeyword(keyword: string, marketplace = "US") {
  return callMCPTool({
    name: "sorftime_market_query",
    arguments: { keyword, marketplace },
  });
}

/** 按 ASIN 查询竞品数据 */
export async function queryCompetitorByASIN(asin: string, marketplace = "US") {
  return callMCPTool({
    name: "sorftime_asin_query",
    arguments: { asin, marketplace },
  });
}

/** 查询关键词搜索量和 CPC */
export async function queryKeywordData(keywords: string[], marketplace = "US") {
  return callMCPTool({
    name: "sorftime_keyword_query",
    arguments: { keywords, marketplace },
  });
}

/** 查询类目大盘数据 */
export async function queryCategoryOverview(categoryId: string, marketplace = "US") {
  return callMCPTool({
    name: "sorftime_category_overview",
    arguments: { categoryId, marketplace },
  });
}

/** 查询品牌集中度 */
export async function queryBrandConcentration(keyword: string, marketplace = "US") {
  return callMCPTool({
    name: "sorftime_brand_concentration",
    arguments: { keyword, marketplace },
  });
}

/** 查询利润测算（FBA费用 + 佣金） */
export async function queryFBAEstimates(asin: string, price: number, marketplace = "US") {
  return callMCPTool({
    name: "sorftime_fba_estimate",
    arguments: { asin, price, marketplace },
  });
}

/** 查询1688供应商数据 */
export async function query1688Supplier(productName: string) {
  return callMCPTool({
    name: "sorftime_1688_supplier",
    arguments: { productName },
  });
}

/** 查询 Review 数据 */
export async function queryReviews(asin: string, maxResults = 100, marketplace = "US") {
  return callMCPTool({
    name: "sorftime_review_query",
    arguments: { asin, maxResults, marketplace },
  });
}

/** 查询竞品定价数据 */
export async function queryCompetitorPricing(keyword: string, marketplace = "US") {
  return callMCPTool({
    name: "sorftime_competitor_pricing",
    arguments: { keyword, marketplace },
  });
}

/** 查询销量预估 */
export async function querySalesEstimate(asin: string, marketplace = "US") {
  return callMCPTool({
    name: "sorftime_sales_estimate",
    arguments: { asin, marketplace },
  });
}
