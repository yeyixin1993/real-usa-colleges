# Google Maps + Petal Maps airport route links / Google Maps + Petal Maps 机场路线链接

## English

### What the links do

The site stores each verified campus coordinate and each FAA airport reference
coordinate once. It creates Google Maps primary links and Petal Maps fallback
links in both directions:

- airport to campus;
- campus to airport.

The primary link format is the official Google Maps URL format:

```text
https://www.google.com/maps/dir/?api=1&origin={lat,lng}&destination={lat,lng}&travelmode=driving
```

Google's documentation says Maps URLs need no API key. The Petal fallback is:

```text
https://www.petalmaps.com/routes/?saddr={lat,lng}&daddr={lat,lng}&type=drive
```

Opening either link sends the stored endpoints to that provider's route-planning
page. The college site does not call a routing API, so repeated visitor clicks
do not create per-request API charges for this project.

### Verification boundary

- Campus coordinates: U.S. Department of Education College Scorecard.
- Airport coordinates: FAA 28-Day NASR Airport CSV.
- Route result: calculated by Google Maps or Petal Maps only after the visitor opens the link;
  it is not returned to or stored by this website.
- Distance and time: remain Unverified unless a dated result and source are
  recorded separately.
- Public transit: no automatic Petal link is generated because availability
  varies by region.

Access to either Google Maps or Petal Maps from mainland China is not guaranteed.
Google is shown first because its Maps URL contract is publicly documented;
Petal remains available as a fallback. Neither shortcut is evidence for any
displayed distance or travel time.

## 中文

### 链接如何工作

网站只保存一次每所学校已核实的校园坐标，以及 FAA 官方机场参考坐标。随后分别生成 Google Maps 主链接和 Petal Maps 备用链接：

- 机场到学校；
- 学校到机场。

Google Maps 主链接使用官方格式：

```text
https://www.google.com/maps/dir/?api=1&origin={纬度,经度}&destination={纬度,经度}&travelmode=driving
```

Google 官方说明 Maps URL 不需要 API key。Petal 备用格式为：

```text
https://www.petalmaps.com/routes/?saddr={纬度,经度}&daddr={纬度,经度}&type=drive
```

点击后，浏览器会把已保存的起点和终点传给对应地图服务。本网站不会发起路线 API 请求，因此用户反复点击不会为本项目产生按请求计费的路线 API 成本。

### 核实边界

- 校园坐标：美国教育部 College Scorecard。
- 机场坐标：FAA 28-Day NASR Airport CSV。
- 路线结果：用户打开链接后由 Google Maps 或 Petal Maps 现场计算，不会回传或保存到本网站。
- 距离和时间：除非另行保存带日期的结果和来源，否则继续标为“尚未核实”。
- 公共交通：因地区覆盖不同，不自动生成 Petal 公交预链接。

Google Maps 和 Petal Maps 在中国大陆网络中的可访问性均不能保证。Google Maps 因拥有公开且稳定的 Maps URL 参数规范而作为主入口，Petal 继续作为备用。两种快捷链接都不能核实页面中原有的距离或行程时间。
