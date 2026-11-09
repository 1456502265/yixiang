# 译想官网

译想（原 TransQuickly / 翻译快）的中文产品官网，面向外贸、跨境电商客服及跨国沟通场景。基于原有 Astro 脚手架重建，保留原官网主要栏目、URL、蓝白配色和原有图片，提供可直接部署到 Cloudflare Workers Static Assets 的静态产物。

本次在本地完成开发，**尚未替换生产网站或提交 Google 广告复审**。网站重建不能保证解除“恶意软件 / 被侵网站”判定；安装包、更新链、原服务器和域名状态需要另外核验。详细记录见 [广告政策排查与上线清单](docs/广告政策排查与上线清单.md)。

## 技术栈

| 项目 | 当前配置 |
| --- | --- |
| 页面框架 | Astro 7.4.7，构建时生成静态 HTML |
| 开发语言 | TypeScript 5.9.3、Astro、原生 CSS |
| 交互 | 原生 HTML 导航展开与本站帮助目录搜索 |
| SEO | `@astrojs/sitemap`、canonical、社交分享元信息、JSON-LD |
| 部署 | Cloudflare Workers Static Assets，Wrangler 4.158.0 |
| 运行环境 | Node.js >= 22.23.4；本次使用 Node.js 24.13.0 |

原脚手架使用 Astro 5、Cloudflare SSR 适配器、MDX 和 RSS。新版官网不需要服务器渲染、博客示例和数据库，因此移除了这些依赖及对应示例文件，保留 Astro + TypeScript + Cloudflare 路线。升级依赖并删除未使用的适配器，减少构建和部署依赖。当前没有在线后台管理、登录、支付或表单提交功能。页面内容由 Astro 静态生成，直接通过 Cloudflare Static Assets 发布。

已清理 Astro 默认 favicon、Atkinson 示例字体、未引用的重复图片、旧博客空目录和未使用样式；Cloudflare 配置已移除静态站不需要的 Node 兼容标记。TypeScript 保留为开发检查依赖。

## 本地运行

```bash
npm ci
npm run dev
```

默认访问 `http://localhost:4321`。移动端导航使用原生 `details`，关闭 JavaScript 后仍可浏览全部文档；帮助搜索只筛选当前页面上的文档标题、分类与简介，不向服务器发送搜索内容。

```bash
npm run check
```

完整检查依次执行 Astro 类型检查、生产构建、静态站点校验和 Cloudflare 部署预检，不会实际发布。

| 命令 | 用途 |
| --- | --- |
| `npm run dev` | 启动开发服务器 |
| `npm run build` | 构建到 `dist/`，同步配置的响应头 |
| `npm run preview` | 预览已经构建的产物 |
| `npm run verify` | 检查已有 `dist/` 的页面、SEO、链接与资源 |
| `npm run check` | 类型检查、构建、站点检查和部署预检 |
| `npm audit` | 检查 npm 已知依赖漏洞 |
| `npm run deploy` | 使用当前 Cloudflare 登录凭据发布 `dist/` |

不要仅运行 `astro build` 后直接发布：`npm run build` 还会执行安全响应头生成脚本。开发服务器的响应头不代表 Cloudflare 的最终响应头；需要核验响应头和重定向时，可在构建后运行：

```bash
npx wrangler dev --local --port 8787
```

## 目录结构

```text
src/
  config/
    domain.mjs                  # 正式官网域名，SEO 和站点地图等统一读取
    site.ts                     # 联系方式、公司、备案和全站导航
    downloads.ts                # 各平台版本、文件信息与下载开放状态
  data/
    product.ts                  # 功能、平台、引擎及应用场景
    pricing.ts                  # 老站套餐价格、引擎范围、积分表与常见问题
    help.json                   # 34 篇帮助文档
    privacy-policy.json         # 从原官网迁移的软件隐私条款
    user-service-agreement.json # 从原官网迁移的软件服务协议
  components/                   # 功能、价格、平台、帮助侧栏和协议正文
  layouts/SiteLayout.astro      # 全站头尾、SEO 和结构化数据
  pages/                        # 主要栏目、协议、帮助文档与 404
  styles/global.css             # 全站蓝白视觉与响应式样式
public/
  images/                       # 原官网图片，本地托管
  scripts/help-search.js        # 本站帮助搜索，无网络请求
  # robots.txt 由 src/pages/robots.txt.ts 自动生成
  _headers                      # 通用安全响应头模板
  _redirects                    # 旧价格地址永久重定向
scripts/
  clean-build.mjs               # 构建前校验并清理本项目 dist
  finalize-build.mjs            # 同步 public/_headers 到构建产物
  verify-site.mjs               # 静态构建产物检查
  lib/files.mjs                 # 文件遍历工具
  # HTTP 响应检查说明见下方验证记录
docs/
  asset-sources.json            # 图片原地址、本地文件和下载大小
  广告政策排查与上线清单.md
```

`.audit/` 是本地调研临时目录，已忽略，不会随网站发布。`dist/` 是构建结果，不是日常编辑入口。`npm run build` 会先校验并清空本项目的旧 `dist/`，再生成新产物，防止已删除的文件继续发布。公共资源会直接公开，不要在 `public/` 放日志、密钥、内部文档或未核验的安装包。

## 页面与原地址

保留 8 个主栏目、2 个协议页面、34 个帮助文档，再加 1 个 404，共 45 个生成页面；44 个可索引页面进入站点地图。

| 页面 | 路径 |
| --- | --- |
| 首页 | `/` |
| 团队方案 | `/tuanduifangan/` |
| 产品介绍 | `/product/` |
| 价格方案 | `/price/` |
| 软件下载 | `/download/` |
| 帮助中心 | `/help/` |
| 关于我们 | `/about/` |
| 联系我们 | `/contact/` |
| 隐私政策 | `/privacy-policy/` |
| 用户服务协议 | `/user-service-agreement/` |
| 帮助详情 | `/help/<原有文档路径>/` |
| 未找到页面 | `/404.html`，返回 404，禁止索引 |

`/price1` 和 `/price1/` 301 跳转到 `/price/`。帮助文档保留旧路径，包括安装、注册、重置密码、各界面区域、聊天设置、客户档案、套餐订单、子账户和设置等。网络代理文档仅保留已获授权的企业网络配置说明。

原博客模板的 `/blog/`、`/rss.xml` 等不是原官网业务页面，已删除，不再对外提供示例文章。

## 统一维护联系方式

只编辑 `src/config/site.ts`：

- `phone` / `phoneHref`：展示电话与拨号链接，应同步修改。
- `email`：客服邮箱，页脚、联系页和协议里的联系邮箱统一读取。
- `channels`：微信、WhatsApp、Telegram 的名称、文字、链接和二维码。
- `company`、`address`、`hours`、`icp`、`police`：运营主体、地址、服务时间和备案。

全站右侧悬浮客服栏同样读取此配置，点击微信、WhatsApp、Telegram 按钮可查看二维码及联系入口；手机端显示在右下角。新增或调整图标时修改渠道的 `icon` 字段。

二维码文件放到 `public/images/`，再修改配置里的路径。更新联系方式时，文字、二维码内容与跳转链接需要指向同一客服渠道。此处是代码集中配置，不是在线管理后台；修改后需要重新构建、部署。

## 下载管理

`src/config/downloads.ts` 中四个版本已按用户要求开放下载，沿用原官网地址：

| 版本 | 原官网下载地址 |
| --- | --- |
| Windows版 | `https://dl.yixiang.chat/download/YiXiang-win-x64.exe` |
| Windows 7版 | `https://dl.yixiang.chat/download/YiXiang-win7-x64.exe` |
| MacOS-M版 | `https://dl.yixiang.chat/download/YiXiang-mac-arm64.dmg` |
| MacOS-Intel版 | `https://dl.yixiang.chat/download/YiXiang-mac-x64.dmg` |

`enabled` 控制是否开放该版本；`url` 是实际下载链接。四个地址本次 HEAD 检查均返回 200，未下载或运行安装包，不代表已完成软件安全扫描。地址校验保留官方 HTTPS 域名限制，不因未填写可选的版本、发布日期、发布者和 SHA-256 信息而阻止下载；可选信息只在有真实数据时填写并显示，不要编造。

遇到 Windows、macOS 或安全软件警告，应暂停安装并核实，不引导用户关闭保护或绕过警告。签名也不等于文件绝对安全。系统列表和配置要求沿用老站：Windows版支持 Windows 8 / 10 / 11，另有 Windows 7版；MacOS-M版适用 M1 / M2 / M3，MacOS-Intel版适用 Intel 芯片，两者要求 MacOS 11 及以上。Windows 要求 4GB 内存、2GB 硬盘，Mac 要求 2GB 硬盘。下载开放状态由 `enabled` 单独控制。

## Google 转化标签

全站布局 `src/layouts/SiteLayout.astro` 已接入 Google Tag Manager 容器 `GTM-MP9WBHRK`，在异步加载前初始化 `dataLayer`、`gtag` 和 GTM 启动事件。具体 Google Ads 转化标签、转化 ID / Label 与触发条件需要在该 GTM 容器后台配置并发布；接入容器本身不代表转化事件已配置或验证成功。

CSP 不再限制脚本、图片和样式，也不再为内联脚本生成哈希或 nonce。统计回传仍受 `connect-src` 规则约束，GTM 容器新增其他标签时需按实际请求验证。

## 原站视频

首页使用 HTML 原生 `<video controls playsinline preload="none">` 播放四段原站视频，支持浏览器自带的播放、暂停、进度、音量与全屏操作。MP4 地址、原视频 ID 和本地封面在 `src/config/videos.ts` 集中维护；组件为 `src/components/ProductVideo.astro`。

视频使用原站保利威 CDN 公开提供的 HTTPS MP4 文件，本次逐条检查均返回 200、类型为 `video/mp4`。封面保存在 `public/images/video-*.jpg`。不再加载保利威播放器脚本，不使用 iframe 或中间播放页，不自动播放；点击播放前不预加载视频文件。响应头只为视频文件开放 `https://dpv.videocc.net` 的媒体请求。

本次未完成真实浏览器播放、拖动进度及全屏验收。若后续视频 CDN 配置变化，请更新真实文件地址，不要使用临时签名地址或推测链接。

## 内容、价格与图片

原站事实性内容的误写、遗漏修正及保留差异，见 [文案事实核对记录](docs/文案事实核对记录.md)。

- 修改功能、引擎、平台与使用场景：`src/data/product.ts`。
- 修改帮助文档：`src/data/help.json`；保留 `slug` 可避免旧地址失效。
- 套餐金额、各版引擎、7 行积分价格及退款等规则统一维护于 `src/data/pricing.ts`，沿用老站价格页；首页使用 `src/components/HomePricing.astro`，沿用原首页免费版 ¥0、积分版 ¥75/100万字符、包月版 ¥49起/月；价格方案页使用 `src/components/Pricing.astro`，展示基础版49元/月、专业版75元/月、高级版99元/月。两者的金额和权益数据统一维护于 `src/data/pricing.ts`；积分明细及常见问题位于 `src/pages/price.astro`。不要自行概括或改变套餐权益。
- 图片保存在 `public/images/`，来源记录见 `docs/asset-sources.json`。本次没有使用同行图片或生成图片。
- 软件协议正文保留原公开版本，并非本次重新认证的合同或数据事实。客户端权限、数据保存、第三方处理和退款规则应由运营方按真实产品核对。

原官网的 3 万体验积分、49 / 75 / 99 元包月参考价以及积分参考价格已保留；没有虚构新优惠、评价或客户数量。团队方案按用户要求恢复老站的章节、文案和对比数据；价格页恢复老站的套餐权益、计费与退款说明。安装无警告、银行级可用性等表述未恢复。

## SEO 与安全设计

每页包含独立 title、description、canonical、中文语言声明、Open Graph、Twitter 分享信息和 JSON-LD。结构化数据展示组织、网站、页面及内页面包屑，不虚构评分、认证或客户评价。内容构建成 HTML，主要阅读和导航不依赖前端框架运行。

- 正式域名：`https://www.yixiang.chat`。
- 站点地图：`/sitemap-index.xml` 与 `/sitemap-0.xml`。
- 图片：首屏主图优先加载，后续图片延迟加载，提供替代文本和尺寸。
- 404：真实 404，不使用 SPA 全站回退，不加入 sitemap。
- 无 WordPress 主题、jQuery、嵌入客服或自动下载脚本；已按要求接入 Google Tag Manager 转化容器。原站的 4 段视频已恢复，使用浏览器原生 video 播放 HTTPS MP4 文件。
- `_headers` 设置 CSP、防嗅探、防嵌入、来源策略及权限策略。
- 脚本、图片和样式不设 CSP 限制；保留字体、连接、框架、媒体等其他 CSP 指令及通用安全响应头。
- `/_astro/` 带内容哈希的资源设置长期缓存。其余图片与 HTML 不设置不可变缓存。

更换正式域名时，只需修改 `src/config/domain.mjs` 中的 `siteUrl`，再重新构建。Astro、canonical、分享链接、结构化数据、站点地图、robots.txt 和构建检查自动使用新地址。新域名尚未提供时，该配置暂时保留原值；页面文案不再写死旧官网域名。原安装包仍使用 `dl.yixiang.chat`，客服邮箱仍为 `service@yixiang.chat`，需要更换时分别修改下载配置和联系方式配置。

## CSP 与统计脚本

按当前要求，已移除 `script-src`、`img-src`、`style-src` 及其 `default-src` 回退限制；不再生成脚本哈希或注入 nonce，也不需要额外的 HTML Worker。`npm run deploy` 直接发布 `dist/`。

字体、网络请求、iframe、媒体以及防嵌入等规则仍由 `public/_headers` 控制。GTM 和统计脚本发出的请求仍需符合 `connect-src`。

本地验证实际响应（另开终端运行第二条命令）：

```bash
npx wrangler dev --local --port 8787
npm run verify:csp
```

检查覆盖脚本、图片、样式限制及默认回退已移除，其他安全响应头仍在，404、重定向和静态资源缓存正常。验收生产响应头请使用 Wrangler，本地 Astro 开发服务器不代表最终托管响应。

## 部署到 Cloudflare

先确认当前 Cloudflare 账号、Worker 项目与目标域名，避免误覆盖其他服务。原项目 Worker 名称为 `yixiang`，配置保留在 `wrangler.json`，现在使用 `assets.directory: ./dist`，不再依赖生成的 SSR Worker。

```bash
npm ci
npm run check
npm run deploy
```

部署需要你的 Cloudflare 登录状态或平台设置的访问凭据。不要将 API Token 写入仓库。也可通过 Cloudflare 的 Git 构建流程执行 `npm ci`、`npm run check`，随后发布当前 `dist/`。

部署后将 `www.yixiang.chat` 连接到该 Worker，并在域名/CDN 层统一 HTTPS、配置非 www 到 www 的永久跳转。代码没有自动修改 DNS、停用 WordPress、清理下载服务器或旧 CDN 缓存。

切换前先备份；切换后检查新页面、404、旧价格重定向、联系方式、二维码、真实响应头及站点地图，确认所有地区和域名变体不再访问旧环境。其他静态托管平台可使用 `dist/`，但 `_headers` 和 `_redirects` 是 Cloudflare 约定，需要转换为目标平台规则。

## 本次验证记录

- Astro 类型检查：0 错误、0 警告、0 提示。
- 生产构建：45 页成功生成。
- 自动站点检查：独立标题和描述、唯一 H1、canonical、sitemap、JSON-LD 与响应头、站内链接和锚点、本地资源、图片属性、34 个保留帮助路由通过。
- Cloudflare 预检：`wrangler deploy --dry-run` 成功，未发布。
- 本地 Wrangler HTTP：首页、帮助页和下载页返回 200；旧价格地址返回 301；不存在页面返回 404；安全响应头及本站搜索脚本响应正常。
- 依赖审计：更新后的依赖审计为 0 个已知漏洞。该结果与查询时间有关，不是恶意软件扫描或安全认证。
- 视觉验收限制：本次浏览器连接不可用，未完成桌面/手机真实浏览器截图、交互及 Lighthouse 验收。响应式规则已实现，上线前仍需在真实设备检查。
- 生产与软件检查限制：未访问广告账号、原服务器、域名后台、安装包及更新链，未提交任何复审申请。

## 广告问题后续处理

请阅读 [广告政策排查与上线清单](docs/广告政策排查与上线清单.md)，按实际报错完成服务器、下载链和域名检查后再提交复审。重点依据 Google 的[被侵网站政策](https://support.google.com/adspolicy/answer/15938376)与[恶意软件政策](https://support.google.com/adspolicy/answer/15939580)。

同行页面仅用于参考公开信息组织，未据此推断其已通过审核。本站不会按审核身份差异化展示内容，也没有隐藏真实下载或跳转到备用域名的逻辑。
