# Campus demographic fields to consider / 可考虑增加的校内人口字段

Source / 来源: U.S. Department of Education College Scorecard,
September 2025 Institution-Level Technical Documentation and May 19, 2025
institution-level data release.

- Technical documentation: <https://collegescorecard.ed.gov/files/InstitutionDataDocumentation.pdf>
- Data catalog and dictionary: <https://catalog.data.gov/dataset/college-scorecard>

## Recommended next additions / 建议下一批加入

These fields describe the fall undergraduate student body and are the closest
match to the campus-composition panel already shown on the site.

这些字段描述秋季本科生构成，与网站当前“校内人口结构”面板的口径最接近。

| Field | English definition | 中文定义 | Recommendation |
| --- | --- | --- | --- |
| `UGDS_MEN` | Share of degree/certificate-seeking undergraduates who are men | 男性本科生比例 | Added / 已加入 |
| `UGDS_WOMEN` | Share of degree/certificate-seeking undergraduates who are women | 女性本科生比例 | Added / 已加入 |
| `UGDS_AIAN` | American Indian/Alaska Native share | 美洲印第安人/阿拉斯加原住民比例 | Add, with full label / 建议加入完整名称 |
| `UGDS_NHPI` | Native Hawaiian/Pacific Islander share | 夏威夷原住民/太平洋岛民比例 | Add, with full label / 建议加入完整名称 |
| `UGDS_2MOR` | Two or more races share | 两个或以上种族比例 | Add / 建议加入 |
| `UGDS_UNKN` | Race/ethnicity unknown share | 种族/族裔未知比例 | Add as a data-quality context row / 建议作为数据质量提示 |
| `PPTUG_EF` | Share of degree/certificate-seeking undergraduates enrolled part time | 非全日制本科生比例 | Add / 建议加入 |
| `UG25ABV` | Share of undergraduates age 25 or older | 25 岁及以上本科生比例 | Added when present / 有值时已加入 |

The current site already imports `UGDS`, `UGDS_WHITE`, `UGDS_BLACK`,
`UGDS_HISP`, `UGDS_ASIAN`, `UGDS_NRA` (nonresident students), `UGDS_MEN`,
`UGDS_WOMEN`, and `UG25ABV`.

当前网站已导入 `UGDS`、`UGDS_WHITE`、`UGDS_BLACK`、`UGDS_HISP`、
`UGDS_ASIAN`、`UGDS_NRA`（非美国居民学生）、`UGDS_MEN`、
`UGDS_WOMEN` 和 `UG25ABV`。

## Useful, but not the same population denominator / 有用但口径不同

These should appear in a separate “access and socioeconomic context” section,
not be mixed into the race/gender percentages. Their populations and cohort
years differ.

以下指标适合放入独立的“教育机会与经济背景”部分，不应与种族/性别百分比混排，因为统计人群和年份不同。

| Field(s) | Meaning / 含义 | Caution / 注意事项 |
| --- | --- | --- |
| `PCTPELL`, `FTFTPCTPELL` | Pell Grant recipient share / Pell 助学金学生比例 | All undergraduates versus full-time first-time cohorts must be labeled separately / 全体本科生与首次全日制新生口径不同 |
| `PCTFLOAN`, `FTFTPCTFLOAN` | Federal student-loan recipient share / 联邦学生贷款比例 | Financial-aid participation, not campus composition / 属于资助参与度而非人口构成 |
| `NUM1_*`–`NUM5_*` | Counts of aided, full-time first-time students by family-income bracket / 按家庭收入区间划分的受助首次全日制学生人数 | Covers Title IV-aided students, not every student / 只覆盖 Title IV 受助学生 |
| `PAR_ED_PCT_1STGEN` | First-generation share from FAFSA / FAFSA 首代大学生比例 | Documentation says this cohort series was last updated in 2018 and the FAFSA definition changes in 2025 / 技术文档说明该序列最后更新于 2018，且 2025 年 FAFSA 定义变化 |
| `FAMINC`, `MD_FAMINC`, `FAMINC_IND` | Mean/median family income for entry cohorts / 入学队列家庭收入均值、中位数 | Older Title IV/FAFSA cohort; nominal dollars and not the full current student body / 较旧的受助队列、名义美元、并非当前全部学生 |
| `MARRIED`, `DEPENDENT`, `VETERAN` | Married, dependent, and veteran shares / 已婚、受抚养、退伍军人比例 | Older entry-cohort data; not recommended for the main current panel / 较旧入学队列，不建议放在当前主面板 |

## Keep outside “campus demographics” / 不放入“校内人口结构”

Admission rate, SAT/ACT, tuition, net price, retention, completion, transfer,
debt, repayment, and earnings are available in College Scorecard, but they are
admissions, cost, or outcomes—not current campus demographics. They should get
their own sourced sections if added.

College Scorecard 还提供录取率、SAT/ACT、学费、净价、留存率、毕业率、转学、
负债、还款和收入等字段，但它们属于录取、成本或结果，不属于当前校内人口结构；
如要加入，应放在独立且标明来源与年份的模块。
