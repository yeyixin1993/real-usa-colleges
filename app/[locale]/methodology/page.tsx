import type { Metadata } from 'next';

import { SectionHeading } from '@/components/shared/section-heading';
import { Card, CardContent } from '@/components/ui/card';
import { getDictionary, getLocaleOrThrow } from '@/lib/i18n';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = getLocaleOrThrow(localeParam);
  const dictionary = getDictionary(locale);

  return {
    title: dictionary.methodology.title,
    description: dictionary.methodology.description,
  };
}

export default async function MethodologyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeParam } = await params;
  const locale = getLocaleOrThrow(localeParam);
  const dictionary = getDictionary(locale);
  const copy = {
    en: {
      description: 'Verified values link to a reviewable source. Original values remain visible with an Unverified label while they are reviewed one by one.',
      verified: 'Verified and published',
      verifiedBody: 'Institution identity, location, federal fields, undergraduate demographics, 1991–2020 monthly normals, and 2021–2025 observed monthly temperature extremes. Each climate record identifies its selected NOAA station and distance.',
      blank: 'Visible but unverified',
      blankBody: 'Original climate details, nearby businesses, routing, airport access, Uber, surrounding-area demographics, and custom scores remain visible with an amber Unverified label until a source is attached.',
      map: 'Map rule',
      mapBody: 'Pins use the federal latitude/longitude for the matched institution. The site never substitutes a city centroid, state centroid, or randomized offset.',
      source: 'Primary sources',
      sourceBody: 'U.S. Department of Education College Scorecard — May 19, 2025 institution-level release; NOAA U.S. Monthly Climate Normals, 1991–2020, version 1.0.1; and NOAA GHCN-Daily observations for 2021–2025. Recent observations are actual daily extremes, not replacement climate normals.',
      maintenance: 'Data maintenance',
      maintenanceBody: 'Imports reject unmatched or ambiguous records. Recent extremes exclude quality-flagged observations and require at least 90% data coverage. Missing values remain blank. Precipitation and snowfall use millimeters. Airport route values require a timestamped routing result before they can be marked Verified.',
    },
    zh: {
      description: '已核实数据附有可打开核对的来源；其他原有数据继续显示，并标注“尚未核实”，再逐项审核。',
      verified: '已核实并发布',
      verifiedBody: '学校身份、位置、联邦字段、本科生人口构成、1991–2020 月度气候常值，以及 2021–2025 实测月度气温极值；每条气候记录均标明 NOAA 气象站及距离。',
      blank: '显示但尚未核实',
      blankBody: '原有气候细节、附近商家、路线、机场、Uber、周边人口数据和自定义评分继续显示；附上来源前标注为琥珀色“尚未核实”。',
      map: '地图规则',
      mapBody: '地图标记使用联邦数据中匹配学校的经纬度；绝不以城市中心、州中心或随机偏移代替。',
      source: '主要来源',
      sourceBody: '美国教育部 College Scorecard（2025 年 5 月 19 日学校级数据）、NOAA 1991–2020 美国月度气候常值 1.0.1 版，以及 NOAA GHCN-Daily 2021–2025 逐日观测。近期数据是实际日极值，不是替代气候常值。',
      maintenance: '数据维护规则',
      maintenanceBody: '导入遇到未匹配或多重匹配时会拒绝写入。近期极值排除质量标记观测，每月数据覆盖率至少达到 90%；缺失值保持为空。降水和降雪统一使用毫米。机场路线必须保存带时间戳的路线结果后才能标为“已核实”。',
    },
    ja: {
      description: '検証済みの値には確認用の出典リンクを付け、その他の元データは「未検証」として表示しながら順次確認します。',
      verified: '検証済み・公開中',
      verifiedBody: '学校情報、所在地、連邦項目、学部生構成、1991–2020年の月別平年値、2021–2025年の月別実測気温極値。気候記録には NOAA 観測所と距離を明記します。',
      blank: '表示中・未検証',
      blankBody: '元の気候詳細、周辺店舗、経路、空港、Uber、周辺人口、独自スコアは表示を続け、出典が付くまで琥珀色の「未検証」と表示します。',
      map: '地図のルール',
      mapBody: 'マーカーは照合済み学校の連邦データ緯度・経度を使用し、都市中心・州中心・ランダムずらしは使いません。',
      source: '一次資料',
      sourceBody: '米国教育省 College Scorecard（2025年5月19日学校単位版）、NOAA 米国月間気候平年値（1991–2020年、v1.0.1）、NOAA GHCN-Daily（2021–2025年）。最近の値は実測日別極値で、平年値の代替ではありません。',
      maintenance: 'データ保守ルール',
      maintenanceBody: '照合不能・重複照合の記録はインポートしません。最近の極値は品質フラグ付き観測を除外し、月90%以上のデータ網羅率を必要とします。欠損値は空欄のままです。降水量と降雪量はmm表示です。空港経路はタイムスタンプ付き結果を保存した場合のみ検証済みになります。',
    },
  }[locale];

  return (
    <main className="container section-space space-y-8">
      <SectionHeading title={dictionary.methodology.title} description={copy.description} />
      <section className="grid gap-5 lg:grid-cols-3">
        {[
          {
            title: copy.verified,
            body: copy.verifiedBody,
          },
          {
            title: copy.blank,
            body: copy.blankBody,
          },
          {
            title: copy.map,
            body: copy.mapBody,
          },
        ].map((item) => (
          <Card key={item.title}>
            <CardContent className="space-y-3 p-6">
              <h2 className="text-xl font-semibold text-slate-950">{item.title}</h2>
              <p className="text-sm leading-7 text-slate-600">{item.body}</p>
            </CardContent>
          </Card>
        ))}
      </section>
      <Card>
        <CardContent className="space-y-4 p-8">
          <h2 className="text-2xl font-semibold text-slate-950">{copy.source}</h2>
          <p className="text-sm leading-7 text-slate-600">{copy.sourceBody}</p>
          <div className="flex flex-wrap gap-4">
            <a className="text-sm font-medium text-primary" href="https://catalog.data.gov/dataset/college-scorecard">College Scorecard data catalog</a>
            <a className="text-sm font-medium text-primary" href="https://www.ncei.noaa.gov/products/land-based-station/us-climate-normals">NOAA U.S. Climate Normals</a>
            <a className="text-sm font-medium text-primary" href="https://www.ncei.noaa.gov/products/land-based-station/global-historical-climatology-network-daily">NOAA GHCN-Daily</a>
          </div>
        </CardContent>
      </Card>
      <Card id="data-transparency">
        <CardContent className="space-y-4 p-8">
          <h2 className="text-2xl font-semibold text-slate-950">{copy.maintenance}</h2>
          <p className="text-sm leading-7 text-slate-600">{copy.maintenanceBody}</p>
        </CardContent>
      </Card>
    </main>
  );
}
