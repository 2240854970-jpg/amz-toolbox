// 选品方法枚举
export type SelectionMethod =
  | "keyword"
  | "asin"
  | "category"
  | "competitor"
  | "trend";

// 选品分析请求
export interface SelectionRequest {
  method: SelectionMethod;
  input: string; // 关键词或ASIN
  marketplace?: string; // 站点，默认 US
  category?: string;
}

// 市场概况
export interface MarketOverview {
  totalMarketSize: number;
  avgMonthlySales: number;
  avgPrice: number;
  avgBSR: number;
  seasonality: string;
  growthTrend: string;
  dataSource: string;
}

// 竞争格局
export interface CompetitiveLandscape {
  top10BrandVolatility: number; // %
  newEntrants6m: number;
  reviewThreshold: number; // 评论门槛
  concentrationLevel: "分散" | "中等" | "集中" | "高度集中";
  avgRating: number;
  dataSource: string;
}

// 关键词矩阵
export interface KeywordMatrix {
  primaryKeywords: { keyword: string; searchVolume: number; cpc: number; competition: string }[];
  longTailKeywords: { keyword: string; searchVolume: number; relevance: number }[];
  dataSource: string;
}

// 利润测算
export interface ProfitEstimate {
  fbaFee: number;
  referralFee: number;
  cogs: number; // 采购成本
  logistics: number; // 头程
  otherCosts: number;
  estimatedMargin: number; // %
  breakevenPrice: number;
  dataSource: string;
}

// 差异化空间
export interface DifferentiationSpace {
  painPoints: string[];
  featureGaps: string[];
  priceGaps: string;
  opportunityScore: number; // 1-10
}

// 完整选品报告
export interface SelectionReport {
  marketOverview: MarketOverview;
  competitiveLandscape: CompetitiveLandscape;
  keywordMatrix: KeywordMatrix;
  profitEstimate: ProfitEstimate;
  differentiationSpace: DifferentiationSpace;
  recommendation: string;
  riskWarning: string;
  generatedAt: string;
}

// 采购需求书
export interface ProcurementRequisition {
  productName: string;
  specifications: string[];
  qualityRequirements: string[];
  moq: number;
  targetPrice: number;
  packaging: string;
  certifications: string[];
  supplierQuestions: string[];
}

// Listing 全案
export interface ListingFullCase {
  dataAnalysis: string;
  copywriting: {
    title: string;
    bulletPoints: string[];
    description: string;
    searchTerms: string[];
  };
  imageStrategy: ImagePlan[];
  aplusLayout: APlusSection[];
  keywordPlan: { root: string[]; longTail: string[]; negative: string[] };
}

export interface ImagePlan {
  slot: number; // 1-7 主图
  type: "场景" | "功能" | "尺寸" | "对比" | "包装" | "视频" | "A+";
  description: string;
  promptForAI: string;
  needsPostEditing: boolean;
}

export interface APlusSection {
  moduleType: string;
  content: string;
  promptForAI: string;
}

// 上架策略
export interface LaunchStrategy {
  pricing: {
    medianCompetitorPrice: number;
    recommendedLaunchPrice: number;
    targetPrice: number;
    discountStrategy: string;
  };
  stagAdStructure: {
    coreCampaign: AdCampaign;
    autoCampaign: AdCampaign;
    categoryCampaign: AdCampaign;
    broadCampaign: AdCampaign;
  };
  salesProjection: { week: number; projectedSales: number; projectedACoS: number }[];
}

export interface AdCampaign {
  budget: number;
  bidStrategy: string;
  keywords: string[];
  budgetShare: string; // "40-50%"
}

// 广告优化
export interface AdOptimizationResult {
  negativeKeywords: string[];
  bidAdjustments: { keyword: string; currentBid: number; suggestedBid: number; reason: string }[];
  wastedSpend: number;
  optimizationSummary: string;
}

// VOC 分析
export interface VOCAnalysisResult {
  kanoModel: {
    mustHave: string[];
    performance: string[];
    delight: string[];
    indifferent: string[];
    reverse: string[];
  };
  sentimentBreakdown: { positive: number; neutral: number; negative: number };
  topPainPoints: { issue: string; frequency: number; severity: "高" | "中" | "低" }[];
  improvementRoadmap: { priority: number; action: string; expectedImpact: string }[];
}

// 利润核算
export interface ProfitBreakdown {
  sku: string;
  revenue: number;
  fbaFees: number;
  referralFees: number;
  cogs: number;
  advertising: number;
  logistics: number;
  returns: number;
  netProfit: number;
  margin: number;
}

// 退货分析
export interface ReturnAnalysisResult {
  totalReturns: number;
  returnRate: number;
  categories: { reason: string; count: number; percentage: number }[];
  improvementPlan: { action: string; target: string; timeline: string }[];
}

// 文案优化
export interface CopyOptimizationResult {
  diagnosis: string[];
  beforeAfter: {
    field: string;
    before: string;
    after: string;
    reason: string;
  }[];
  seoScore: { before: number; after: number };
}

// 视觉优化
export interface VisualOptimizationResult {
  diagnosis: string[];
  aiGeneratedImages: { slot: number; url: string; prompt: string; usable: boolean }[];
  briefForDesigner: string;
}

// 多站点本地化
export interface LocalizationResult {
  targetMarketplace: string;
  localizedTitle: string;
  localizedBullets: string[];
  localizedDescription: string;
  localKeywords: string[];
  culturalNotes: string;
}
