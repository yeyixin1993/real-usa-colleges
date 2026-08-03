import type { Metadata } from 'next';

import { RankingsBoard } from '@/components/rankings/rankings-board';
import { Card, CardContent } from '@/components/ui/card';
import { getSchools } from '@/lib/data';
import { getLocaleOrThrow } from '@/lib/i18n';
import { buildRankings } from '@/lib/rankings';
import { getScoringConfig } from '@/lib/server/scoring-config';
import type { Locale } from '@/types/school';

export const dynamic = 'force-dynamic';

const copy = {
  en: {
    title: 'Cold, village, and undergraduate demographic rankings',
    description: 'Five switchable rankings using January average minimum temperature, annual snowfall, population within 30 km, and the share of White undergraduates.',
    coldFormulaTitle: 'Cold ranking formula',
    formulaTitle: 'Combined ranking formula',
    method: 'Cold combines lower January normal minimum temperatures and higher annual snowfall. Village ranks smaller 30 km populations first. White-share ranks higher reported White undergraduate shares first. Each input becomes a 0–100 percentile before weighting; tied raw values share a rank. The inverse composite is the exact reverse order of the combined ranking.',
    caveat: 'These are descriptive comparisons, not measures of academic quality. The White-share ranking describes reported undergraduate composition and must not be interpreted as a diversity, desirability, or school-quality score.',
    inverseCaveat: '“Inverse composite” does not use Asian or Latino shares; it only reverses the combined score shown here.',
    missing: 'A school is included only when all four verified fields are present; missing values are never estimated.',
    sources: 'Verified sources',
    noaa: 'NOAA U.S. Climate Normals — January monthly normal minimum temperature, 1991–2020',
    worldpop: 'WorldPop — 2020 population-count grid within a 30 km geodesic radius',
    scorecard: 'U.S. Department of Education College Scorecard — White undergraduate share',
  },
  zh: {
    title: '冷村白排名',
    description: '根据 1 月月均最低气温、年降雪量、方圆 30 km 内人口和白人本科生占比，提供五种可切换排名与三个单项倒序功能。',
    coldFormulaTitle: '冷排名公式',
    formulaTitle: '冷村白加权公式',
    method: '冷排名综合“1 月月均最低气温越低”和“年降雪量越高”；村排名按 30 km 内人口由少到多；白排名按白人本科生占比由高到低。每个输入先转换成站内 0–100 百分位分数再加权；原始值相同则并列。暖橙黄排名严格按冷村白加权分倒序。',
    caveat: '这些排名仅描述气候、周边人口规模和本科生人口构成，不代表学术质量。“白排名”不得解释为多样性、优越性、适合度或学校质量评分。',
    inverseCaveat: '“暖橙黄”只是倒序名称，算法不使用亚裔或拉丁裔占比，也不代表对任何群体的评价。',
    missing: '只有四个已核实字段都存在的学校才参与排名；缺失值不会推算或补造。',
    sources: '已核实来源',
    noaa: 'NOAA 美国气候常值——1991–2020 年 1 月月正常最低温与年降雪量',
    worldpop: 'WorldPop——校园 30 km 测地半径内的 2020 人口计数网格',
    scorecard: '美国教育部 College Scorecard——白人本科生占比',
  },
  ja: {
    title: '寒さ・小人口圏・白人学部生比率ランキング',
    description: '1月平均最低気温、年間降雪量、30 km圏内人口、白人学部生比率から5つの切替可能な順位を作成します。',
    coldFormulaTitle: '寒さ順位の式',
    formulaTitle: '加重順位の式',
    method: '寒さは低い1月平均最低気温と多い年間降雪量を組み合わせます。小人口圏は30 km圏内人口が少ない順、白人比率は学部生比率が高い順です。各入力を0–100の百分位に変換してから加重し、同値は同順位です。逆順の加重順位は、通常の加重順位を厳密に反転します。',
    caveat: '学術的な質を示す順位ではありません。白人学部生比率は報告された構成の記述であり、多様性・望ましさ・学校の質の評価として解釈しないでください。',
    inverseCaveat: '逆順の加重順位はアジア系・ラテン系比率を使用せず、ここに表示する加重スコアだけを反転します。',
    missing: '4つの検証済み項目がすべてある学校だけを掲載し、欠損値は推定しません。',
    sources: '検証済み出典',
    noaa: 'NOAA 米国気候平年値 — 1991–2020年の1月平均最低気温と年間降雪量',
    worldpop: 'WorldPop — キャンパスから30 km測地半径内の2020年人口グリッド',
    scorecard: '米国教育省 College Scorecard — 白人学部生比率',
  },
} satisfies Record<Locale, Record<string, string>>;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = getLocaleOrThrow(localeParam);
  return { title: copy[locale].title, description: copy[locale].description };
}

export default async function RankingsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeParam } = await params;
  const locale = getLocaleOrThrow(localeParam);
  const text = copy[locale];
  const [schools, scoringConfig] = await Promise.all([getSchools(), getScoringConfig()]);
  const rankings = buildRankings(schools, scoringConfig.rankingWeights, scoringConfig.coldRankingWeights);
  const formatWeight = (value: number) => `${Number((value * 100).toFixed(2))}%`;
  const coldFormula = locale === 'zh'
    ? `1 月低温百分位 ${formatWeight(scoringConfig.coldRankingWeights.januaryTemperature)} + 年降雪量百分位 ${formatWeight(scoringConfig.coldRankingWeights.annualSnowfall)}`
    : locale === 'ja'
      ? `1月低温百分位 ${formatWeight(scoringConfig.coldRankingWeights.januaryTemperature)} + 年間降雪量百分位 ${formatWeight(scoringConfig.coldRankingWeights.annualSnowfall)}`
      : `January-low percentile ${formatWeight(scoringConfig.coldRankingWeights.januaryTemperature)} + annual-snowfall percentile ${formatWeight(scoringConfig.coldRankingWeights.annualSnowfall)}`;
  const formula = locale === 'zh'
    ? `冷百分位 ${formatWeight(scoringConfig.rankingWeights.cold)} + 村百分位 ${formatWeight(scoringConfig.rankingWeights.village)} + 白人占比百分位 ${formatWeight(scoringConfig.rankingWeights.white)}`
    : locale === 'ja'
      ? `寒さ百分位 ${formatWeight(scoringConfig.rankingWeights.cold)} + 小人口圏百分位 ${formatWeight(scoringConfig.rankingWeights.village)} + 白人比率百分位 ${formatWeight(scoringConfig.rankingWeights.white)}`
      : `Cold percentile ${formatWeight(scoringConfig.rankingWeights.cold)} + village percentile ${formatWeight(scoringConfig.rankingWeights.village)} + White-share percentile ${formatWeight(scoringConfig.rankingWeights.white)}`;

  return (
    <main className="container section-space space-y-8">
      <header className="max-w-4xl space-y-4">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Data rankings</p>
        <h1 className="text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl">{text.title}</h1>
        <p className="text-lg leading-8 text-slate-600">{text.description}</p>
      </header>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card><CardContent className="space-y-3 p-6"><h2 className="text-lg font-semibold text-slate-950">{text.coldFormulaTitle}</h2><p className="font-medium text-primary">{coldFormula}</p><h2 className="pt-2 text-lg font-semibold text-slate-950">{text.formulaTitle}</h2><p className="font-medium text-primary">{formula}</p><p className="text-sm leading-7 text-slate-600">{text.method}</p></CardContent></Card>
        <Card><CardContent className="space-y-3 p-6"><p className="text-sm leading-7 text-slate-700">{text.caveat}</p><p className="text-sm leading-7 text-slate-700">{text.inverseCaveat}</p><p className="text-sm leading-7 text-slate-500">{text.missing}</p></CardContent></Card>
      </div>

      <RankingsBoard rows={rankings} locale={locale} />

      <Card>
        <CardContent className="space-y-3 p-6">
          <h2 className="text-lg font-semibold text-slate-950">{text.sources}</h2>
          <ul className="space-y-2 text-sm leading-6">
            <li><a className="text-primary underline underline-offset-2" href="https://www.ncei.noaa.gov/products/land-based-station/us-climate-normals" target="_blank" rel="noreferrer">{text.noaa}</a></li>
            <li><a className="text-primary underline underline-offset-2" href="https://worldpop.arcgis.com/arcgis/rest/services/WorldPop_Total_Population_1km/ImageServer" target="_blank" rel="noreferrer">{text.worldpop}</a></li>
            <li><a className="text-primary underline underline-offset-2" href="https://catalog.data.gov/dataset/college-scorecard" target="_blank" rel="noreferrer">{text.scorecard}</a></li>
          </ul>
        </CardContent>
      </Card>
    </main>
  );
}
