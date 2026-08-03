# Data verification policy

The public site keeps the original dataset visible while verification proceeds.
Every data group is labeled either **Verified** or **Unverified**. A Verified
label requires a named source and a URL that viewers can open. Values without
that evidence remain visible under an Unverified label and must not be described
as authoritative.

## Current verified sources

### College identity, location, and demographics

- Source: U.S. Department of Education College Scorecard
- Release: `Most Recent Cohorts Institution-Level Data, May 19, 2025`
- Catalog: <https://catalog.data.gov/dataset/college-scorecard>
- Archive: <https://ed-public-download.scorecard.network/downloads/Most-Recent-Cohorts-Institution_05192025.zip>
- Imported fields: UNITID, institution name, city, state, public/private control,
  institution website, latitude/longitude, undergraduate enrollment, and
  undergraduate race/ethnicity shares, male undergraduate share (`UGDS_MEN`),
  female undergraduate share (`UGDS_WOMEN`), age-25-and-older undergraduate
  share (`UG25ABV`), and IPEDS locale code (`LOCALE`).

The public three-category campus setting is derived transparently from the
official 12-category IPEDS locale: City 11–13 = Urban, Suburb 21–23 =
Suburban, and Town/Rural 31–43 = Rural. The page also displays the original
IPEDS locale label and code so this collapse can be audited.

College Scorecard fields may represent different cohort years. Consult the
release's data dictionary before adding a year label or comparing time-sensitive
values.

To reproduce the checked-in import:

```sh
node scripts/import-college-scorecard.mjs /path/to/Most-Recent-Cohorts-Institution_05192025.csv
```

The importer requires a unique institution match, uses explicit UNITID aliases
for naming variants, and refuses to write output when a school is unmatched or
ambiguous.

### Population within 30 km

- Source: WorldPop, University of Southampton
- Dataset: `Global High Resolution Population Denominators Project`
- Image service: <https://worldpop.arcgis.com/arcgis/rest/services/WorldPop_Total_Population_1km/ImageServer>
- DOI: <https://doi.org/10.5258/SOTON/WP00647>
- Vintage: 2020 population counts, approximately 1 km grid

For every verified campus coordinate, the importer constructs a 72-vertex
geodesic polygon approximating a 30.0 km circle and asks the WorldPop image
service to sum the 2020 population-count cells inside it. This is a reproducible
gridded estimate, not a Census enumeration, an exact building-level count, or a
claim about the 2026 population. The UI links to the source service and states
the dataset vintage.

```sh
npm run data:import:worldpop-radius
```

### Monthly temperature normals

- Source: NOAA National Centers for Environmental Information
- Release: `U.S. Monthly Climate Normals, 1991–2020, version 1.0.1`
- Product page: <https://www.ncei.noaa.gov/products/land-based-station/us-climate-normals>
- Inventory: <https://www.ncei.noaa.gov/data/normals-monthly/1991-2020/doc/inventory_30yr.txt>
- Data service: <https://www.ncei.noaa.gov/access/services/data/v1>
- Imported fields: monthly normal maximum temperature and monthly normal
  minimum temperature.

For each of the 112 campuses, the importer evaluates nearby conventional NOAA
stations, rejects incomplete series, and selects the nearest station with all 12
months of both temperature fields. The checked-in result records the station ID,
name, coordinates, elevation, and campus-to-station distance. In the current
import, the average distance is 3.9 miles and the maximum is 15.9 miles.

To reproduce the import after downloading the official inventory:

```sh
node scripts/import-noaa-temperature.mjs /path/to/inventory_30yr.txt
```

These are station normals, not campus measurements.

### Precipitation and snowfall normals

- Source: NOAA National Centers for Environmental Information
- Release: `U.S. Monthly Climate Normals, 1991–2020, version 1.0.1`
- Product page: <https://www.ncei.noaa.gov/products/land-based-station/us-climate-normals>
- Fields: `MLY-PRCP-NORMAL` and `MLY-SNOW-NORMAL`

Precipitation and snowfall are verified separately because the closest complete
station can differ by metric. For each campus and metric, the importer chooses
the nearest station with all 12 published monthly normals, sums those months,
and stores the station metadata and campus distance. All 112 schools currently
have complete precipitation and snowfall coverage. Values are stored and shown
in millimeters.

```sh
npm run data:import:noaa-precip-snow -- /path/to/inventory_30yr.txt
```

### Relative humidity

- Source: NASA POWER
- Parameter: `RH2M` (relative humidity at 2 meters)
- Period: custom 1991–2020 climatology
- Documentation: <https://power.larc.nasa.gov/docs/services/api/temporal/climatology/>

The annual mean is requested for each verified campus coordinate. NASA POWER
meteorology is derived from MERRA-2, so this is gridded model/assimilation data,
not an on-campus sensor reading. The displayed site band is a transparent local
classification: Dry below 50%, Balanced from 50% through 65%, and Humid above
65%. All 112 schools currently have a sourced RH2M value.

```sh
npm run data:import:nasa-humidity
```

### Recent observed temperature extremes

The recent-weather importer reads NOAA GHCN-Daily Version 3 daily `TMAX` and
`TMIN` observations for 2021-01-01 through 2025-12-31. For each calendar month,
it publishes the highest observed daily maximum and lowest observed daily
minimum plus their dates. These values are not averages and are not described
as climate normals. Quality-flagged observations are excluded, and a monthly
value is left blank unless at least 90% of expected days are present.

```sh
npm run data:import:noaa-recent
```

Temperature observations are stored in Celsius. Annual precipitation and
snowfall are both displayed in millimeters.

## Manually verified fields

The protected admin editor retains the previous climate-detail, convenience,
airport, Uber, and score structures. The original values remain public with an
Unverified label. When an admin adds both a source label and source URL, that
group changes to Verified and the public label includes the source link. Uber
and mobility use the same rule through the mobility source fields.

Place identity, airport metrics, and Uber campus availability can also be
verified independently. Their links appear beside the exact item or metric they
support, without changing the status of unsourced distance, routing, count,
delivery, wait-time, or scoring fields. See `data/UBER_VERIFICATION.md` for the
Uber sampling method.

The map uses the verified College Scorecard campus coordinates. Users can select
or click a state to fit the map to that state and list its schools.

### Google Maps and Petal Maps airport shortcuts

The project does not call HERE, Google, or Petal routing APIs when a visitor
opens an airport route. It stores verified College Scorecard campus coordinates
and FAA 28-Day NASR airport coordinates once, then generates both Google Maps
Directions URLs and Petal Maps fallback URLs for airport-to-campus and
campus-to-airport routes.

```sh
npm run data:generate:petal-airport-links -- /path/to/APT_BASE.csv
```

Google Maps is the primary shortcut and uses the documented Maps URL format
with `api=1`, `origin`, `destination`, and `travelmode=driving`. Google states
that Maps URLs need no API key. Petal fallbacks retain their `saddr`, `daddr`,
and `type=drive` parameters. The website does not receive a route result and
incurs no per-click routing API charge.

Neither provider's accessibility from mainland China is guaranteed. These links
are route-planning shortcuts, not evidence that the original distance or time
on the site is correct. Public-transit links are not generated. Existing
distance, driving-time, and transit-time values remain Unverified until
separately checked and sourced. See `data/PETAL_MAPS_LINKS.md`.

## Unverified fields still being reviewed

These original fields remain visible but Unverified until the listed source and
method are implemented and documented:

| Field group | Preferred source and method |
| --- | --- |
| Surrounding-area demographics | U.S. Census Bureau ACS 5-year API; use a documented geospatial 30-mile aggregation rather than city or county substitution. |
| Nearby businesses | Official chain locators or a dated, licensed places dataset; store place ID, coordinates, retrieval date, and query radius. |
| Distance and travel time | A dated routing result from a named routing provider; retain origin, destination, mode, and retrieval timestamp. |
| Airports and flights | FAA airport data plus BTS or official airline/airport schedules; do not infer connectivity from airport size alone. |
| Rankings | The ranking publisher's official edition with edition year and permitted citation; do not carry ranking bands across years. |
| Custom scores and tags | Mark Verified only after every input is sourced and the calculation is reproducible from checked-in configuration. |

The legacy seed modules provide the original contextual values during the
transition. They are never silently promoted to Verified. Source metadata is
stored separately so each group can be audited and upgraded one by one.

---

# 数据核实政策（简体中文）

网站在核实过程中继续显示原始数据。每组数据必须标为“已核实”或“尚未核实”。只有在附有用户可打开的来源名称和 URL 时，才能标为“已核实”；没有证据的数值可以继续显示，但不得描述为权威数据。

## 当前已核实来源

### 学校身份、位置和校内人口结构

- 来源：美国教育部 College Scorecard
- 版本：`Most Recent Cohorts Institution-Level Data, May 19, 2025`
- 数据目录：<https://catalog.data.gov/dataset/college-scorecard>
- 归档下载：<https://ed-public-download.scorecard.network/downloads/Most-Recent-Cohorts-Institution_05192025.zip>
- 已导入字段：UNITID、学校名称、城市、州、公立/私立、学校官网、经纬度、本科生人数、本科生种族/族裔比例、男性本科生比例（`UGDS_MEN`）、女性本科生比例（`UGDS_WOMEN`）、25 岁及以上本科生比例（`UG25ABV`）及 IPEDS 校园地理类型（`LOCALE`）。

前端的三分类由官方 IPEDS 12 分类透明归并：City 11–13 = Urban，Suburb 21–23 = Suburban，Town/Rural 31–43 = Rural。页面仍显示原始 IPEDS 类型名称和代码，便于复核此归并。

College Scorecard 不同字段可能对应不同统计年度。添加年份标签或比较时间敏感字段前，必须检查该版本的数据字典。

可重复导入命令：

```sh
node scripts/import-college-scorecard.mjs /path/to/Most-Recent-Cohorts-Institution_05192025.csv
```

导入器要求每所学校唯一匹配；遇到未匹配或多重匹配时会拒绝写入结果。

### 方圆 30 km 内人口

- 来源：英国南安普顿大学 WorldPop
- 数据集：`Global High Resolution Population Denominators Project`
- 官方影像服务：<https://worldpop.arcgis.com/arcgis/rest/services/WorldPop_Total_Population_1km/ImageServer>
- DOI：<https://doi.org/10.5258/SOTON/WP00647>
- 数据年份：2020 人口计数，约 1 km 网格

导入器以已核实校园坐标为圆心，用 72 个顶点构造近似 30.0 km 的测地圆，并由 WorldPop 服务汇总圆内 2020 人口计数网格。这是可以重复计算的栅格估计，不是人口普查逐户计数、建筑级精确人数，也不代表 2026 年实时人口。前端链接来源服务并标明数据年份。

```sh
npm run data:import:worldpop-radius
```

### 月度气温常值

- 来源：NOAA National Centers for Environmental Information
- 版本：`U.S. Monthly Climate Normals, 1991–2020, version 1.0.1`
- 产品页：<https://www.ncei.noaa.gov/products/land-based-station/us-climate-normals>
- 数据服务：<https://www.ncei.noaa.gov/access/services/data/v1>
- 已导入字段：月正常最高温和月正常最低温。

系统会评估校园附近常规 NOAA 站点，排除不完整序列，并选择拥有 12 个月完整温度字段的最近站点。记录中保存站点 ID、名称、坐标、海拔和校园至站点距离。这些是气象站常值，不是校园推算读数。

### 降水与降雪常值

- 来源：NOAA National Centers for Environmental Information
- 版本：`U.S. Monthly Climate Normals, 1991–2020, version 1.0.1`
- 产品页：<https://www.ncei.noaa.gov/products/land-based-station/us-climate-normals>
- 字段：`MLY-PRCP-NORMAL` 与 `MLY-SNOW-NORMAL`

降水与降雪分别核实，因为两个指标最近的完整气象站可能不同。系统为每所学校、每个指标选择拥有完整 12 个月月常值的最近 NOAA 站点，汇总为年值，并保存站点资料及校园至站点距离。当前 112 所学校的降水和降雪均有完整来源，统一以毫米显示。

```sh
npm run data:import:noaa-precip-snow -- /path/to/inventory_30yr.txt
```

### 相对湿度

- 来源：NASA POWER
- 参数：`RH2M`（地面以上 2 米相对湿度）
- 时段：1991–2020 自定义气候常值
- 文档：<https://power.larc.nasa.gov/docs/services/api/temporal/climatology/>

系统按每所学校已核实的校园坐标获取年平均相对湿度。NASA POWER 气象数据来自 MERRA-2，因此它是网格化模型/同化数据，不是校园内传感器读数。本站分档规则公开为：低于 50% 偏干，50–65% 适中，高于 65% 偏湿。当前 112 所学校均有可追溯的 RH2M 数值。

```sh
npm run data:import:nasa-humidity
```

### 近期实际观测气温极值

近期导入使用 NOAA GHCN-Daily Version 3 的 2021-01-01 至 2025-12-31 每日 `TMAX` 和 `TMIN`。每个自然月显示最高的日最高温、最低的日最低温及发生日期；它们不是月平均值，也不是新的气候常值。排除质量标记数据，每项数据覆盖率不足 90% 时留空。

```sh
npm run data:import:noaa-recent
```

气温以摄氏度保存；年降水量和年降雪量均以毫米显示。

## 后台手动核实字段

后台保留原有气候详情、便利度、机场、Uber 和评分结构。管理员添加来源名称与 URL 后，该字段组才显示“已核实”，前端同时显示可点击来源。地点身份、机场单项指标和 Uber 校园可用性可独立核实，不会把没有来源的距离、路线、数量、外卖、等待时间或评分连带标绿。Uber 采样方法见 `data/UBER_VERIFICATION.md`。

地图使用 College Scorecard 核实的校园坐标。用户可通过下拉菜单或点击州界缩放到该州并查看学校列表。

### Google Maps 与 Petal Maps 机场路线快捷入口

访客打开机场路线时，本项目不调用 HERE、Google 或 Petal 路线 API。系统只保存一次 College Scorecard 已核实校园坐标和 FAA 28-Day NASR 机场坐标，然后为“机场→学校”和“学校→机场”分别生成 Google Maps 主链接与 Petal Maps 备用链接。

```sh
npm run data:generate:petal-airport-links -- /path/to/APT_BASE.csv
```

Google Maps 主链接采用官方 Maps URL 格式，通过 `api=1`、`origin`、`destination` 与 `travelmode=driving` 预填驾车路线；Google 官方说明此类 URL 不需要 API key。Petal 备用链接继续使用 `saddr`、`daddr` 与 `type=drive`。网站不接收路线结果，也不会产生按点击计费的路线 API 成本。

Google Maps 与 Petal Maps 在中国大陆网络中的可访问性都不能保证。因此这些按钮只属于路线规划快捷入口，不能自动核实页面原有的距离或时间。系统不自动生成公共交通预链接；原有距离、驾车时间和公共交通时间继续显示为“尚未核实”，直至分别完成核实并附来源。详见 `data/PETAL_MAPS_LINKS.md`。

## 仍在审核的字段

| 字段组 | 优先来源与方法 |
| --- | --- |
| 周边人口结构 | 使用美国人口普查局 ACS 5 年数据，并采用有记录的 30 英里地理聚合，不以城市或县数据代替。 |
| 附近商家 | 使用品牌官方门店页面或带日期、许可明确的地点数据库；保存地点 ID、坐标、查询日期和半径。 |
| 距离与行程时间 | 保存指定路线服务的带日期结果，以及起点、终点、出行方式和检索时间。 |
| 机场与航班 | 使用 FAA 机场数据、BTS 或机场/航空公司官方时刻表；不得仅根据机场规模推断国际连通性。 |
| 排名 | 使用发布方官方版本并记录年份；不得跨年份沿用排名区间。 |
| 自定义评分与标签 | 只有在所有输入有来源且能通过项目配置重复计算时才能标为已核实。 |

过渡期间原有数据继续显示，但不会被自动升级为“已核实”。来源元数据单独保存，以便逐字段审计和更新。
