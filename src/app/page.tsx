import Link from "next/link";

const phases = [
  {
    title: "选品期",
    color: "#ff9900",
    modules: [
      {
        href: "/selection",
        title: "选品分析",
        desc: "支持5种选品方法，输入关键词或ASIN，AI按11板块框架出完整报告——市场概况、竞争格局、关键词矩阵、利润测算、差异化空间。",
        steps: "关键词/ASIN → Sorftime实时数据 → AI 11板块报告",
      },
      {
        href: "/selection/procurement",
        title: "采购需求书",
        desc: "选品完成后一键生成采购需求书：规格、质量、MOQ报价表，直接发给1688供应商。",
        steps: "选品数据 → 采购需求书 → 供应商询价",
      },
    ],
  },
  {
    title: "上架期",
    color: "#4caf50",
    modules: [
      {
        href: "/listing",
        title: "Listing全案",
        desc: "6步流程：数据分析 → COSMO+VOC+关键词三源融合文案 → 图片策略 → AI生图 → 一键导出Word/Excel。",
        steps: "ASIN输入 → 三源融合 → 文案+图片策略 → 导出",
      },
      {
        href: "/listing/strategy",
        title: "上架策略",
        desc: "锚定竞品中位价定价（冷启动低于中位价85%），STAG广告架构搭建，20周阶梯销售预测。",
        steps: "竞品数据 → 定价策略 → STAG架构 → 20周预测",
      },
    ],
  },
  {
    title: "运营期",
    color: "#2196f3",
    modules: [
      {
        href: "/operations",
        title: "广告优化",
        desc: "上传STR报表，AI自动分析出否词和出价建议，识别无效花费。",
        steps: "上传STR → AI分析 → 否词+出价建议",
      },
      {
        href: "/operations/voc",
        title: "VOC深度分析",
        desc: "12板块消费者洞察 + KANO模型分类，从Review里挖出真正能指导产品改进的洞察。",
        steps: "输入ASIN → Review抓取 → KANO分类 → 改进路线图",
      },
      {
        href: "/operations/profit",
        title: "利润核算",
        desc: "每个SKU拆开算真实利润：收入、FBA费、佣金、广告、头程、退货，净利一目了然。",
        steps: "输入成本数据 → 逐SKU拆解 → 真实利润表",
      },
      {
        href: "/operations/returns",
        title: "退货分析",
        desc: "退货原因自动分类 + 改进路线图，从退货数据中找到产品迭代方向。",
        steps: "上传退货报表 → AI分类 → 改进路线图",
      },
    ],
  },
  {
    title: "优化期",
    color: "#9c27b0",
    modules: [
      {
        href: "/optimization",
        title: "文案优化",
        desc: "老品诊断 + Before/After对比优化，SEO评分提升量化。",
        steps: "输入ASIN → 诊断 → Before/After优化 → SEO评分",
      },
      {
        href: "/optimization/visual",
        title: "视觉优化",
        desc: "图片诊断 + AI双轨出图（Gemini Image + Seedream），标注可用图和需后期图。",
        steps: "图片诊断 → AI双轨生图 → 筛选标注 → 美工brief",
      },
      {
        href: "/optimization/localization",
        title: "多站点本地化",
        desc: "不是翻译，是重写。连本地关键词都帮你换好，附带文化适配说明。",
        steps: "输入ASIN → 目标站点 → 本地化重写 → 本地关键词替换",
      },
    ],
  },
];

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      {/* Hero */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-3">
          <span className="text-[#ff9900]">AMZ</span> Toolbox
        </h1>
        <p className="text-lg text-[#a0a0a0] max-w-2xl">
          把10年亚马逊运营经验沉淀成提示词和框架，
          让AI按照你的方式执行——选品、Listing、运营、优化，四个阶段全覆盖。
        </p>
        <div className="flex gap-3 mt-5">
          <span className="px-3 py-1 rounded-full bg-[#1a1a1a] text-xs text-[#a0a0a0] border border-[#2a2a2a]">
            Next.js
          </span>
          <span className="px-3 py-1 rounded-full bg-[#1a1a1a] text-xs text-[#a0a0a0] border border-[#2a2a2a]">
            Gemini / DeepSeek / Claude
          </span>
          <span className="px-3 py-1 rounded-full bg-[#1a1a1a] text-xs text-[#a0a0a0] border border-[#2a2a2a]">
            Sorftime MCP
          </span>
          <span className="px-3 py-1 rounded-full bg-[#1a1a1a] text-xs text-[#a0a0a0] border border-[#2a2a2a]">
            Vercel
          </span>
        </div>
      </div>

      {/* Phase cards */}
      <div className="space-y-8">
        {phases.map((phase) => (
          <div key={phase.title}>
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full inline-block"
                style={{ backgroundColor: phase.color }}
              />
              {phase.title}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {phase.modules.map((mod) => (
                <Link
                  key={mod.href}
                  href={mod.href}
                  className="block p-5 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] hover:border-[#ff9900]/30 hover:bg-[#242424] transition-all group"
                >
                  <h3 className="font-semibold text-[#f0f0f0] group-hover:text-[#ff9900] transition-colors">
                    {mod.title}
                  </h3>
                  <p className="text-sm text-[#a0a0a0] mt-2 leading-relaxed">
                    {mod.desc}
                  </p>
                  <div className="mt-3 pt-3 border-t border-[#2a2a2a] flex items-center gap-2 text-xs text-[#666]">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    {mod.steps}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
