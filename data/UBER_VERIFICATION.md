# Uber verification method

Uber coverage and Uber reliability are different claims and must not share one
verification flag.

## 1. Campus availability

Mark campus availability Verified only when one of these sources explicitly
names the campus or its city:

1. an official university transportation page;
2. an official airport or municipal transportation page; or
3. Uber's official city availability page.

The public record must retain the source label, URL, and checked date. A city
page verifies that requests are supported in that city; it does not prove a
short wait at the campus. An official university pickup-zone page is stronger
campus-specific evidence.

## 2. Ease and waiting time

Do not derive wait time from population, food scores, or urban/rural labels. To
verify actual ease, collect timestamped Uber estimates for the exact federal
campus coordinates using the Uber rider app/site or an authorized Uber Ride
Request API integration. Store:

- campus latitude/longitude and destination;
- local timestamp and time-zone;
- offered products;
- quoted pickup ETA and fare range;
- whether no drivers were available;
- the evidence URL/API response or a dated screenshot;
- the collection method and collector.

Recommended minimum sampling is four weeks with at least three windows per
week: weekday daytime, weekday late night, and weekend late night. Publish the
median and 90th-percentile ETA plus the no-driver rate. Keep the result
Unverified until the sample and calculation are retained.

Suggested labels:

- **Reliable:** no-driver rate <= 5% and late-night P90 ETA <= 20 minutes.
- **Conditional:** no-driver rate <= 20% and late-night P90 ETA <= 40 minutes.
- **Limited:** anything worse, or insufficient sampling.

These thresholds are project policy, not Uber claims, and must remain visible
next to the score methodology.

## 3. Uber Eats

Verify Uber Eats separately. A city page may establish city-level service, but
campus delivery should be tested using the campus delivery address. Retain the
restaurant count shown for the address, timestamp, and evidence. Do not infer
Uber Eats from ride availability.

## UCLA starting evidence

- UCLA Transportation states that UCLA partnered with Uber for campus pickup
  zones active 24 hours a day, seven days a week:
  <https://transportation.ucla.edu/getting-around-campus/ride-hailing-ucla>
- UCLA Transportation states that Uber and Lyft serve the UCLA campus and LAX:
  <https://transportation.ucla.edu/getting-to-ucla/lax-union-station>
- Uber's official Los Angeles page states that Uber is available in Los Angeles
  24/7 and publishes recent average route data for LAX to Westwood:
  <https://www.uber.com/global/en/r/cities/los-angeles-ca-us/>

These sources verify availability at UCLA. They do not verify the existing
day/night wait-time values or the composite mobility score, which remain marked
Unverified.

## Colgate starting evidence

- Colgate University states that Uber/Lyft are not reliable in Hamilton and
  recommends advance transportation reservations:
  <https://www.colgate.edu/alumni/campus-events/reunion>
- Another current Colgate travel page says rideshare operates in the region but
  availability in Hamilton can be limited, especially for airport returns:
  <https://www.colgate.edu/community/summer-academic-arts-and-sports-programs/colgate-writers-conference/travel-and>
- Uber's official Hamilton page confirms request support but warns that pickup
  times may be longer than in larger cities:
  <https://www.uber.com/global/en/r/cities/hamilton-ny-us/>

Together these sources support a qualitative Limited/Unreliable classification
for Colgate. They do not validate the original 35/95-minute estimates; those
remain Unverified until timestamped sampling is retained.

---

# Uber 核实方法（简体中文）

Uber 的“覆盖/可用”与“实际好不好打”是两种不同的结论，必须使用不同的核实标记。

## 1. 校园是否可用

只有当下列来源明确提到该校园或所在城市时，才能把“校园可用性”标为“已核实”：

1. 学校官方交通页面；
2. 机场或市政府官方交通页面；或
3. Uber 官方城市服务页面。

公开记录必须保留来源名称、URL 和核实日期。Uber 城市页面只能证明该城市支持叫车，不能证明校园内等待时间很短。学校官方接客区页面能提供更强的校园级证据。

## 2. 是否容易叫到车以及等待时间

不得根据人口、餐饮评分或“城市/乡村”标签推算 Uber 等待时间。要核实实际叫车难易程度，应使用 Uber 乘客端、Uber 网站或获得授权的 Uber Ride Request API，对 College Scorecard 中的校园精确坐标进行带时间戳的重复采样。每次保留：

- 校园经纬度和目的地；
- 当地时间、日期与时区；
- 当时提供的车型；
- 预计接驾时间和价格区间；
- 是否出现无司机可用；
- 证据 URL、API 响应或带日期截图；
- 采集方式和采集人。

建议至少连续采样四周，每周至少覆盖三个时段：工作日白天、工作日深夜、周末深夜。公开结果应包括等待时间中位数、90 分位数（P90）以及无车率。在完整样本和计算结果留档前，等待时间保持“尚未核实”。

建议分级：

- **可靠：** 无车率不高于 5%，且深夜 P90 等待时间不超过 20 分钟。
- **有条件可用：** 无车率不高于 20%，且深夜 P90 等待时间不超过 40 分钟。
- **有限：** 结果更差，或样本不足。

以上阈值是本项目的公开判定规则，不是 Uber 官方结论，必须与评分结果同时展示。

## 3. Uber Eats

Uber Eats 必须单独核实。城市服务页面可以证明城市级覆盖，但校园外卖应以校园具体收货地址实测。需保存该地址显示的餐厅数量、采集时间和证据。不得根据 Uber 叫车可用性推断 Uber Eats 可用性。

## UCLA 起始证据

- UCLA Transportation 说明 UCLA 与 Uber 合作设置校园接客区，并且这些区域每天 24 小时开放：
  <https://transportation.ucla.edu/getting-around-campus/ride-hailing-ucla>
- UCLA Transportation 说明 Uber 和 Lyft 服务 UCLA 校园与 LAX：
  <https://transportation.ucla.edu/getting-to-ucla/lax-union-station>
- Uber 洛杉矶官方页面说明洛杉矶可全天候叫车，并提供 LAX 至 Westwood 的近期路线均值：
  <https://www.uber.com/global/en/r/cities/los-angeles-ca-us/>

这些来源能核实 UCLA 的 Uber 可用性，但不能核实现有日间/夜间等待时间或综合 Mobility Score；后两者继续标为“尚未核实”。

## Colgate 起始证据

- Colgate University 明确说明 Hamilton 的 Uber/Lyft 并不可靠，并建议提前预订交通：
  <https://www.colgate.edu/alumni/campus-events/reunion>
- Colgate 另一份现行交通说明指出网约车在该地区运营，但 Hamilton 的可用性可能有限，尤其不建议把机场返程完全依赖网约车：
  <https://www.colgate.edu/community/summer-academic-arts-and-sports-programs/colgate-writers-conference/travel-and>
- Uber Hamilton 官方页面确认当地支持叫车，同时提醒接驾时间可能比大城市更长：
  <https://www.uber.com/global/en/r/cities/hamilton-ny-us/>

这些证据足以把 Colgate 的 Uber 定性为“有限/不可靠”，但不足以核实原有的日间 35 分钟、夜间 95 分钟等待值；这些具体数值在完成带时间戳采样前继续标为“尚未核实”。
