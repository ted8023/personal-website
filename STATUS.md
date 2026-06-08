# 项目状态文档

> **给新会话读的交接文件。** 读完这份文档，你就能理解这个项目的全貌，并继续维护或扩展它。
>
> 最后更新：2026-06-09 | 当前阶段：v2 设计还原完成，子页面全部按第二版设计重写

**线上地址：** https://personal-website-wheat-gamma-81.vercel.app/

---

## 一、项目简介

**阿秋的个人名片网站** — 用于创业、求职、建立行业影响力等场合直接给人看。

核心定位：**「又会做、又会写、还很有趣的复合型选手」**

GitHub: `https://github.com/ted8023/personal-website`  
本地路径: `/Users/guolei/personal-site`  
分支: `master`（直接在主干开发，无 feature branch）

---

## 二、当前状态

### ✅ v2 完成（已提交 GitHub，Vercel 自动部署中）

| 页面 / 功能 | 路由 | 状态 |
|---|---|---|
| 首页 Hero 巨字循环打字机 + 5 bento 色块 | `/` | ✅ |
| 产品页（masthead + 卡片网格，进行中/早期实验分区）| `/products` | ✅ v2 |
| 写作页（masthead + 编号文章列表，阅读时长）| `/writing` | ✅ v2 |
| 文章详情页（阅读时长估算）| `/writing/[slug]` | ✅ |
| 行业碎想（masthead + 编号碎想列表，碎想·#N）| `/thoughts` | ✅ v2 |
| 哲思随笔（masthead + 编号随笔列表，夜·壹/贰）| `/musings` | ✅ v2 |
| 玩 / 兴趣（masthead + 倾斜卡片网格）| `/play` | ✅ v2 |
| 关于（渐变标题 + facts chips + 6 张 3D 翻转身份牌 + 联系框）| `/about` | ✅ v2 |
| 趣味 404（彩色大字 + 可点击吐槽 + 迷你房间导航）| `/404` | ✅ v2 |
| 纯逻辑单元测试 | `src/lib/*.test.ts` | ✅ 14/14 |
| 响应式 | 全页面 | ✅ |

### ⏳ 待完成

- [ ] **真实内容填充**：把 `src/content/` 和 `src/data/` 里的占位内容替换成阿秋自己的（见第五部分）。
- [ ] **个人信息更新**：`src/data/site.ts` 里的邮箱/GitHub/小红书链接改为真实地址。

### 🔮 v1.5 预留（未实现）

- **命令行彩蛋**：在关于页或全局，敲 `whoami` 等指令唤出隐藏「终端模式」。
- Open Graph / 社交分享 meta 标签（`og:title`、`og:image` 等）。
- `ProductCard` 的 `cover` 字段（schema 已定义，卡片未渲染封面图）。
- 汉堡菜单（移动端 Nav，目前用 `text-xs` 压缩，极窄屏可能溢出）。
- RSS、评论、访问统计、自定义域名。

---

## 三、技术架构

```
Astro 5 (静态站)
├── Tailwind v4 (@tailwindcss/vite 插件)
│   └── @theme 品牌色 token (src/styles/global.css)
├── Content Collections (Markdown → getCollection API)
├── Vitest 3 (纯逻辑 TDD)
└── 部署: Vercel (astro build → dist/)
```

### 关键设计系统（v2）

**CSS 自定义属性设计 token（`src/styles/global.css`）：**

- `--paper` / `--ink` — 背景色和正文色（深色模式下自动切换）
- `--blue` / `--orange` / `--green` / `--purple` / `--pink` — 五板块品牌色
- `--on-*` — 对应品牌色的前景色（浅色或深色）
- `--acc` / `--on-acc` — 当前页面的强调色，由 `body[data-accent="*"]` 触发
- 深色模式：`html[data-theme="dark"]` + `localStorage('aqiu-theme')`

**子页面强调色系统：**

每个子页面通过 `<BaseLayout accent="blue">` 设置 `body[data-accent="blue"]`，全局 CSS 规则自动设置 `--acc` / `--on-acc`，Masthead 背景色、卡片 chip 色、post-list 编号色等全部跟随。

**全局交互（`BaseLayout.astro` `<script>`）：**

| 功能 | 实现 |
|---|---|
| 自定义鼠标 | `.cursor-dot` / `.cursor-ring`，requestAnimationFrame lerp 追踪 |
| 暗色模式 | `localStorage('aqiu-theme')` + `html[data-theme]` |
| 滚动入场 | `.reveal` + IntersectionObserver → `.in` 类 |
| Konami 彩蛋 | ↑↑↓↓←→←→BA → `party()` 全屏礼花 220 粒子 |
| Toast 提示 | `showToast(msg)` 底部居中弹出 |

### 关键设计决策

**1. 动态颜色用 CSS var，不用 Tailwind 动态类**

Tailwind v4 会 purge 掉运行时拼接的类名（如 `` `bg-${color}` ``）。动态颜色全用 `style="--c: var(--blue)"` 或 `data-accent` + CSS 规则实现。

**2. 打字机防重复初始化**

HeroRotator.astro 的 `initTyper()` 在执行前检查 `data-typer-init` 属性，防止 Astro module script 的 DOMContentLoaded + 直接执行双触发导致打两遍。

**3. `astro.config.mjs` 有一个 `@ts-ignore`**

`@tailwindcss/vite` 插件与 Astro 内置 Vite 的类型定义有版本冲突，用 `// @ts-ignore` 绕过，运行时正常。

---

## 四、文件结构速查

```
personal-site/
├── astro.config.mjs          Astro 配置（Tailwind vite 插件，site URL）
├── src/styles/global.css     全站 CSS（@theme token + 所有组件样式）
├── src/lib/                  纯逻辑（TDD），4 个模块 + 测试
│   ├── reading-time.ts       estimateReadingTime(text) → 分钟数
│   ├── rotator.ts            nextIndex(current, length) → 循环索引
│   ├── sort.ts               sortByDateDesc(items, getDate) → 新数组
│   └── filter.ts             matchesFilter(value, active) → bool
├── src/content.config.ts     4 个 content collections 的 schema
├── src/content/              Markdown 内容（当前为占位）
│   ├── products/             type/status/featured/url/tech/order
│   ├── writing/              topic/publishDate/summary/featured
│   ├── thoughts/             date/tags（短碎想，一到几句话）
│   └── musings/              date/tags（哲思随笔，一到几句话）
├── src/data/
│   ├── site.ts               全站文案、hero、about（lede/facts/identityCards）、联系方式
│   ├── sections.ts           5 大板块元数据（slug/label/en/color/accent/mhCn/mhDesc/mhMeta）
│   └── play.ts               电影/狼人杀/剧本杀数据
├── src/layouts/
│   ├── BaseLayout.astro      HTML 壳 + Nav + Footer + 全局脚本（支持 accent prop）
│   └── ArticleLayout.astro   长文阅读排版
├── src/components/
│   ├── Nav.astro             顶部导航，sticky，当前路由高亮
│   ├── Footer.astro          页脚，社交链接 pill + Konami 提示
│   ├── HeroRotator.astro     首页打字机（防重复初始化 guard）
│   └── SectionBlock.astro    bento 色块（含预览列表，支持 large/delay prop）
└── src/pages/
    ├── index.astro           首页（hero + bento 5 色块）
    ├── about.astro           关于页（渐变标题/facts/6 flip-card/contact-box）
    ├── 404.astro             404 页（彩色大字/吐槽/迷你导航）
    ├── products/index.astro  产品页（masthead + card-grid 两分区）
    ├── writing/index.astro   写作页（masthead + 编号 post-list）
    ├── writing/[slug].astro  文章详情
    ├── thoughts/index.astro  碎想页（masthead + 编号列表，碎想·#N）
    ├── musings/index.astro   随笔页（masthead + 编号列表，夜·壹/贰）
    └── play/index.astro      玩耍页（masthead + 倾斜卡片网格）
```

---

## 五、内容更新指南

**新增作品：**
```bash
# 新建 src/content/products/your-product.md
---
title: 产品名
summary: 一句话介绍
type: 网站          # 或 小程序 / App
status: 上线中      # 或 开发中 / 已下线
url: https://...   # 可选，有 url 才会渲染访问箭头
tech: ["Astro", "xxx"]
featured: false    # 只有一个设 true（在首页 bento 预览中置顶）
order: 4           # 控制排序，数字小的在前
---
正文（可选，产品详情页用）
```

**新增长文：**
```bash
# 新建 src/content/writing/your-article.md
---
title: 文章标题
summary: 摘要（写作列表页显示）
topic: 需求分析     # 用于话题分类
publishDate: 2026-06-10
tags: ["方法论"]
featured: false    # 只有一篇设 true（在首页 bento 预览中置顶）
---
正文 Markdown...
```

**新增碎想（行业）：**
```bash
# 新建 src/content/thoughts/2026-06-10-your-thought.md
---
date: 2026-06-10
tags: ["#AI"]
---
一句话或几句话的想法。（直接显示为正文，无详情页）
```

**新增哲思：** 同上，改到 `src/content/musings/`，标签如 `["#哲学"]`。

**更新个人信息：** 编辑 `src/data/site.ts`。
- `hero` — 首页打字机短语、状态行、副文案、CTA 按钮
- `about.lede` — 关于页正文
- `about.facts` — 关于页 emoji 事实 chips
- `identityCards` — 6 张 3D 翻牌（正面 emoji/en，背面角色/描述/配色）
- `contact` — 邮箱/GitHub/小红书等联系方式

**更新玩耍内容：** 编辑 `src/data/play.ts`（电影/狼人杀/剧本杀）。

**发布流程：**
```bash
git add .
git commit -m "content: 新增xxx"
git push   # Vercel 自动触发重新部署（约 1 分钟）
```

---

## 六、设计规范速查

**品牌色（`global.css` 中 CSS 变量，同时映射到 Tailwind token）：**

| 板块 | 变量 | 浅色值 | 文字前景 |
|---|---|---|---|
| 产品 BUILD | `--blue` | `#2D55FF` | `--on-blue: #EAF0FF` |
| 写作 WRITE | `--orange` | `#FF5A14` | `--on-orange: #FFF0E8` |
| 行业碎想 THINK | `--green` | `#00B85C` | `--on-green: #E6FFF1` |
| 哲思随笔 MUSE | `--purple` | `#8A38FF` | `--on-purple: #F3EAFF` |
| 玩/兴趣 PLAY | `--pink` | `#FF2E86` | `--on-pink: #FFE9F2` |
| 背景 | `--paper` | `#F4F2EC` | — |
| 正文 | `--ink` | `#1A1810` | — |

**字体：**
- 中文：`Noto Sans SC`（Google Fonts，400/500/700/900）
- 英文/数字：`Space Grotesk`（Google Fonts，400/500/600/700）

**关键 CSS 类（子页面用）：**

| 类名 | 用途 |
|---|---|
| `.back` | 子页面返回首页链接 |
| `.masthead` | 板块顶部彩色 hero 区块 |
| `.mh-ghost` | Masthead 背景大字（单字母） |
| `.post-list` / `.post` | 文章/碎想列表 |
| `.p-num` / `.p-title` / `.p-ex` / `.p-meta` | 列表项各区域 |
| `.card-grid` / `.card` | 卡片网格 |
| `.c-bar` / `.c-chip` / `.c-name` / `.c-desc` / `.c-foot` | 卡片内部结构 |
| `.row-label` | 卡片网格分区标签 |
| `.card-deck` / `.idcard` | 3D 翻牌卡组 |
| `.idcard-front` / `.idcard-back` | 翻牌正背面 |
| `.rc-blue` 等 | 翻牌背面配色（6 种）|
| `.about-hero` / `.about-lede` / `.facts` / `.fact` | 关于页各元素 |
| `.contact-box` | 联系区块 |
| `.nf-wrap` / `.nf-digits` / `.nf-card` / `.nf-cta` / `.nf-mini` | 404 页各元素 |

---

## 七、开发命令

```bash
npm run dev      # 本地开发 http://localhost:4321
npm run build    # 构建到 dist/
npm run check    # astro check（类型校验，应保持 0 errors）
npm run test     # vitest（14 个单元测试，应全部 pass）
npm run preview  # 本地预览 dist/
```

---

## 八、设计文档索引

完整的设计思路和实现计划存在：

- `docs/superpowers/specs/2026-06-06-personal-card-website-design.md` — 完整设计规格（定位、视觉、信息架构、各页面、技术方案）
- `docs/superpowers/plans/2026-06-06-personal-card-website.md` — 12 个任务的实现计划

参考设计源文件（Anthropic Design API）：
- 第一版设计（首页）：`https://api.anthropic.com/v1/design/h/21tDtLgZuMDhnsA5DUDdqQ`
- 第二版设计（全站）：`https://api.anthropic.com/v1/design/h/DnlIzMQekTnAN5ugwJKjDQ`
