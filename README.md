# 译想官网（精简版）

基于 Astro 的静态官网，当前正式地址统一配置在 `src/config/domain.mjs`。本次参考海译通公开页面的导航、首页模块及功能侧栏结构，内容使用译想原有产品信息、图片、视频、价格和联系方式。

## 页面结构

公开内容从 44 页精简为 9 页，另有 1 个 404 页面。

| 页面 | 地址 |
| --- | --- |
| 首页 | `/` |
| 聊天消息自动翻译 | `/product/` |
| 多引擎翻译 | `/features/engines/` |
| 语音消息翻译 | `/features/voice/` |
| 客户档案与跟进 | `/features/customers/` |
| 快捷回复 | `/features/replies/` |
| 价格方案 | `/price/` |
| 帮助中心（含下载与客服） | `/help/` |
| 用户协议与隐私政策 | `/user-service-agreement/` |

首页按“产品介绍 → 视频展示 → 五项功能 → 三类套餐 → 联系入口”组织。功能页共用“左侧五项目录 + 右侧原图和简短说明”的布局。价格页保留三档包月及七种引擎的积分价格。帮助页合并系统下载、常见问题、计费和联系方式。软件协议原文保留在单独的协议页。

没有增加网页注册、登录、个人中心或在线支付：这些操作仍在译想客户端中进行。未使用同行的商标、图片、评价、用户数量或语音克隆等不属于译想原资料的能力。

## 本地运行与验证

要求 Node.js >= 22.23.4。

```bash
npm ci
npm run dev
```

默认开发地址为 `http://localhost:4321`。

```bash
npm run check
```

依次执行 Astro 类型检查、清理并构建、静态站点校验和 Cloudflare 部署预检，不会发布。

| 命令 | 用途 |
| --- | --- |
| `npm run dev` | 开发预览 |
| `npm run build` | 清理本项目旧 dist，再生成静态页面和响应头 |
| `npm run preview` | 预览已构建的页面 |
| `npm run verify` | 检查生成页面的 SEO、链接、资源、锚点和旧地址跳转 |
| `npm run check` | 类型检查、构建、站点检查和部署预检 |
| `npm run verify:csp` | 在本地 Wrangler 服务上检查当前响应头、404 和缓存；保留现有无 CSP 的部署配置 |
| `npm run deploy` | 发布当前 dist，需要已有 Cloudflare 凭据 |

需要验证实际响应头、旧网址跳转时，构建后运行：

```bash
npx wrangler dev --local --port 8787
npm run verify:csp
```

## 集中维护

| 配置 | 内容 |
| --- | --- |
| `src/config/domain.mjs` | 正式域名，canonical、分享链接、sitemap、robots.txt 及检查脚本统一读取 |
| `src/config/site.ts` | 公司、电话、邮箱、客服时间、微信/WhatsApp/Telegram 和二维码 |
| `src/config/downloads.ts` | 四种系统要求、Google Drive 下载链接及开放状态 |
| `src/config/videos.ts` | 四段原视频 MP4 和本地封面 |
| `src/data/features.ts` | 五个功能页的标题、短文案、原图片及目录 |
| `src/data/pricing.ts` | 原有价格、套餐引擎范围及计费/退款说明 |
| `src/data/user-service-agreement.json` | 原软件服务协议 |
| `src/data/privacy-policy.json` | 原软件隐私政策 |

公司和客服信息继续使用现有值。四个 Google Drive 链接保留，不改回旧下载域名，也不根据访客或广告来源切换下载地址。按钮点击后在新标签页打开 Google Drive，无法访问时可联系客服。

## 原图片、视频和文案

- 网站使用本项目的译想图片，不使用同行图片。
- 首页保留原生 HTML video 的产品演示；帮助页不展示操作演示视频。
- 删除未被精简版引用的图片与旧组件，旧页面内容仍可从 Git 历史恢复；本次修改前的本地快照在已忽略的 `.audit/before-compact-redesign-20261110/`。
- 文案仅保留功能、使用方式、价格及服务信息。没有“3–5 倍客户”“银行级”“安装无警告”“保证成交”等未经本次证实的承诺，也没有移植同行的用户评价、合作企业数量和模型背书。
- 软件合同及隐私条款继续保留原文，官网访问说明按现有 GTM、视频 CDN、Google Drive 和客服链接披露；应与实际发布配置定期核对。

## 旧地址

`public/_redirects` 将团队、关于、联系、下载、隐私和原有 34 个帮助详情地址 301 到新站对应入口。内部链接直接使用新地址，不依赖跳转。

例如：

- `/download/` → `/help/#download`
- `/contact/` → `/help/#contact`
- `/about/` → `/help/#contact`
- `/tuanduifangan/` → `/product/`
- `/privacy-policy/` → `/user-service-agreement/#privacy`
- `/price1/` → `/price/`

不存在的地址返回真实 404。保留独立 title、description、canonical、分享信息、组织及页面 JSON-LD；robots.txt 和 sitemap 在构建时生成。

## 脚本和部署

沿用目前的 `GTM-MP9WBHRK` 配置和 `public/_headers`，本次没有修改 GTM 容器里的标签。它们没有经过广告账号侧或容器后台核验，不能由网页代码推断容器内容安全。页面交互使用原生 details，视频使用原生 video，没有新增第三方 UI、表单或客服 SDK。

站点仍通过 `wrangler.json` 部署到 Cloudflare Workers Static Assets：

```bash
npm ci
npm run check
npm run deploy
```

先确认部署账号、Worker 与域名。凭据通过平台或本机登录管理，不写进源码。`npm run check` 的 dry-run 不会部署、修改 DNS 或提交 Google 复审。

## 广告政策说明

精简文案和页面能改善信息清楚程度，不能证明“被侵网站 / 恶意软件”问题已解除。Google 规则涉及网站实际代码、外链和网站托管或链接的软件；Google Drive 托管也不能替代文件本身的核验。

需要结合 Google Ads 政策详情中的具体网址、Search Console 安全问题、Safe Browsing 状态、DNS/CDN 和旧主机情况，排查实际问题。安装包、更新器、签名、权限、卸载行为和所有下载跳转仍需独立检查。本次未运行安装包，未访问 Ads 或 Search Console 账号，未提交申诉。

参考：

- [Google：被侵网站](https://support.google.com/adspolicy/answer/15938376)
- [Google：恶意软件](https://support.google.com/adspolicy/answer/15939580)
- [同行公开页面](https://www.heiyt.com/)

浏览器连接当前不可用，本次依据同行的公开页面脚本、组件模板和 CSS 核对结构，没有完成真实浏览器截图、移动端交互与视频播放验收。构建和 HTTP 检查结果以本次交付记录为准。
