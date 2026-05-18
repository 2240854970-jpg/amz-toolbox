"use client";

import { useState } from "react";

const marketplaces = [
  { value: "DE", label: "德国 (Amazon.de)", flag: "🇩🇪" },
  { value: "UK", label: "英国 (Amazon.co.uk)", flag: "🇬🇧" },
  { value: "JP", label: "日本 (Amazon.co.jp)", flag: "🇯🇵" },
  { value: "FR", label: "法国 (Amazon.fr)", flag: "🇫🇷" },
  { value: "ES", label: "西班牙 (Amazon.es)", flag: "🇪🇸" },
  { value: "IT", label: "意大利 (Amazon.it)", flag: "🇮🇹" },
  { value: "CA", label: "加拿大 (Amazon.ca)", flag: "🇨🇦" },
  { value: "MX", label: "墨西哥 (Amazon.com.mx)", flag: "🇲🇽" },
];

export default function LocalizationPage() {
  const [asin, setAsin] = useState("");
  const [target, setTarget] = useState("DE");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleLocalize = async () => {
    if (!asin.trim()) return;
    setLoading(true);
    setResult(null);
    await new Promise((r) => setTimeout(r, 2000));

    const mkt = marketplaces.find((m) => m.value === target);

    setResult(`【多站点本地化】${"─".repeat(40)}
源站点：Amazon.com (US)
目标站点：${mkt?.label || target}
ASIN：${asin}
生成时间：${new Date().toLocaleString("zh-CN")}

⚠️ 这不是翻译，是本地化重写。

══════════════════════════════════════════

【标题】
US: Yoga Mat Non Slip, TPE Exercise Mat 6mm for Women,
    Eco Friendly Fitness Mat for Home Gym & Pilates

${target}: ${target === "DE" ? `Rutschfeste Yogamatte 6mm aus TPE – Umweltfreundliche
         Fitnessmatte für Damen, Gymnastikmatte für Home
         Gym, Pilates & Workout` : target === "JP" ? `【ヨガマット】TPE素材 6mm 滑り止め加工 –
         女性用エクササイズマット、エコ素材フィットネス
         マット、自宅トレーニング・ピラティス対応` : `[本地化标题将在此显示]`}

══════════════════════════════════════════

【五点描述】

US Bullet 1 → ${target} 本地化：
${target === "DE" ? "RUTSCHFESTE DOPPELSCHICHT: Die TPE-Oberfläche mit" : ""}
${target === "DE" ? "Lasergravur-Textur bietet 2-fachen Halt im Vergleich" : ""}
${target === "DE" ? "zu herkömmlichen PVC-Matten..." : ""}

${target === "JP" ? "【2層構造の滑り止め】レーザー彫刻加工を施したTPE表面が" : ""}
${target === "JP" ? "従来のPVCマットと比較して2倍のグリップ力を実現..." : ""}

...

══════════════════════════════════════════

【本地关键词替换】

US 关键词 → ${target} 本地关键词：
${target === "DE" ?
  `yoga mat → Yogamatte (搜索量: XX.XXX)
exercise mat → Fitnessmatte / Gymnastikmatte
non slip → rutschfest / rutschhemmend
eco friendly → umweltfreundlich / ökologisch
for women → für Damen / für Frauen
home gym → Home Gym / Heimtraining
pilates mat → Pilatesmatte
thick → dick / 6mm` :
  target === "JP" ?
  `yoga mat → ヨガマット (搜索量: XX.XXX)
exercise mat → エクササイズマット / トレーニングマット
non slip → 滑り止め / グリップ
eco friendly → エコ素材 / 環境に優しい
for women → 女性用 / レディース
home gym → 自宅トレーニング / ホームジム
pilates → ピラティス
thick → 厚手 / 6mm` :
  `[本地关键词将根据目标站点生成]`}

══════════════════════════════════════════

【文化适配说明】
${target === "DE" ?
  `• 德国消费者偏好技术细节和认证（TÜV, GS, Öko-Test）
• "umweltfreundlich"是强购买动机，需在标题体现
• 尺寸标注必须使用公制（cm）
• 五点描述建议包含具体材质成分比例
• A+ 内容建议加入德国本土使用场景（如Bauhaus风格家居）` :
  target === "JP" ?
  `• 日本消费者极度重视"安心·安全"，材质无毒声明必须前置
• 尺寸标注使用厘米，且偏好小巧/收纳方便的产品
• 标题中"女性用""コンパクト"是高频转化词
• 五点描述开头用【】符号概括卖点（日亚惯例）
• A+ 需展示日本住宅场景（榻榻米/フローリング）` :
  `[文化适配建议将根据目标站点生成]`}

══════════════════════════════════════════

【Search Terms 本地化】
${target === "DE" ? "Yogamatte rutschfest, Fitnessmatte Damen, TPE Yogamatte," : ""}
${target === "DE" ? "Gymnastikmatte dick, umweltfreundlich Sportmatte," : ""}
${target === "DE" ? "Home Gym Matte, Pilatesmatte rutschhemmend, ..." : ""}

${target === "JP" ? "ヨガマット 滑り止め, エクササイズマット 厚手," : ""}
${target === "JP" ? "TPE ヨガマット 6mm, 女性用 トレーニングマット," : ""}
${target === "JP" ? "折りたたみ ヨガマット, エコ フィットネスマット, ..." : ""}

══════════════════════════════════════════

【建议操作】
1. 将本地化内容提交至目标站点后台
2. 第一次上架可先做 Listing 文案 + Search Terms
3. A+ 内容可在 Listing 上线后再提交（审核周期不同）

模型：Claude + DeepSeek 交叉校验（非翻译引擎）`);
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#f0f0f0]">多站点本地化</h1>
        <p className="text-sm text-[#a0a0a0] mt-1">不是翻译，是重写——连本地关键词都帮你换好</p>
      </div>

      <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6 mb-6">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-[#a0a0a0] mb-2">源 ASIN（US 站）</label>
            <input type="text" value={asin} onChange={(e) => setAsin(e.target.value)}
              placeholder="例如：B0XXXXXXX"
              className="w-full px-4 py-3 bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg text-[#f0f0f0] placeholder-[#666] focus:outline-none focus:border-[#ff9900]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#a0a0a0] mb-2">目标站点</label>
            <select value={target} onChange={(e) => setTarget(e.target.value)}
              className="w-full px-4 py-3 bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg text-[#f0f0f0] focus:outline-none focus:border-[#ff9900]"
            >
              {marketplaces.map((m) => (
                <option key={m.value} value={m.value}>{m.flag} {m.label}</option>
              ))}
            </select>
          </div>
        </div>
        <button onClick={handleLocalize} disabled={loading || !asin.trim()}
          className="w-full py-3 bg-[#ff9900] text-black font-semibold rounded-lg hover:bg-[#e68a00] disabled:opacity-40 transition-all"
        >
          {loading ? "本地化处理中..." : "开始本地化"}
        </button>
      </div>

      {result && (
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
          <h2 className="text-lg font-semibold text-[#f0f0f0] mb-4">本地化结果</h2>
          <pre className="text-sm text-[#d0d0d0] leading-relaxed whitespace-pre-wrap font-mono bg-[#0f0f0f] rounded-lg p-5 max-h-[70vh] overflow-y-auto">{result}</pre>
        </div>
      )}
    </div>
  );
}
