# 项目状态文档

> **给新会话读的交接文件。** 读完这份文档，你就能理解这个项目的全貌，并继续维护或扩展它。
>
> 最后更新：2026-06-06 | 当前阶段：v1 实现完成，已推送 GitHub，Vercel 部署也已完成

---

## 一、项目简介

**阿秋的个人名片网站** — 用于创业、求职、建立行业影响力等场合直接给人看。

核心定位：**「又会做、又会写、还很有趣的复合型选手」**

GitHub: `https://github.com/ted8023/personal-website`  
本地路径: `/Users/guolei/personal-site`  
分支: `master`（直接在主干开发，无 feature branch）

---

## 二、当前状态

### ✅ v1 完成（已提交 GitHub）

| 页面 / 功能 | 路由 | 状态 |
|---|---|---|
| 首页 Hero 巨字循环 + 5 bento 色块 | `/` | ✅ |
| 产品页（类型筛选 + 主打大卡 + 状态标签）| `/products` | ✅ |
| 写作页（话题筛选 + 置顶代表作）| `/writing` | ✅ |
| 文章详情页（阅读时长估算）| `/writing/[slug]` | ✅ |
| 行业碎想（时间流 + 标签筛选，绿色）| `/thoughts` | ✅ |
| 哲思随笔（时间流 + 标签筛选，紫色）| `/musings` | ✅ |
| 玩 / 兴趣（电影/狼人杀/剧本杀）| `/play` | ✅ |
| 关于（自述 + 身份卡 3D 翻牌彩蛋）| `/about` | ✅ |
| 趣味 404（狼人杀风格）| `/404` | ✅ |
| 纯逻辑单元测试 | `src/lib/*.test.ts` | ✅ 14/14 |
| 响应式 | 全页面 | ✅ |

### ⏳ 待完成

- [ ] **Vercel 部署**：去 [vercel.com/new](https://vercel.com/new) 导入 `ted8023/personal-website`，框架自动识别 Astro，点 Deploy 即可。
- [ ] **部署后**：把 `astro.config.mjs` 里的 `site: 'https://example.vercel.app'` 改成真实的 Vercel 域名，git push。
- [ ] **真实内容填充**：把 `src/content/` 和 `src/data/` 里的占位内容替换成阿秋自己的（见第五部分）。
- [ ] **个人信息更新**：`src/data/site.ts` 里的邮箱/GitHub/小红书链接改为真实地址。

### 🔮 v1.5 预留（未实现）

- **命令行彩蛋**：在关于页或全局，敲 `whoami` 等指令唤出隐藏「终端模式」（把早期被否掉的极客风格作为彩蛋）。架构上已预留空间（client-side `<script>` 岛），只需添加 keydown 监听。
- Open Graph / 社交分享 meta 标签（`og:title`、`og:image` 等）。
- `ProductCard` 的 `cover` 字段（schema 已定义，组件未渲染截图/封面图）。
- 汉堡菜单（移动端 Nav，目前用 `text-xs` 压缩，极窄屏可能溢出）。
- RSS、评论、访问统计、深色模式、多语言、自定义域名。

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

### 关键设计决策

**1. 动态颜色用 `style` 内联，不用 Tailwind 动态类**

`SectionBlock`、`ThoughtStream` 等组件里颜色是运行时确定的（如 `color="think"`），用：
```html
style={`background-color: var(--color-${section.color})`}
```
而不是 `class={`bg-${section.color}`}` —— 后者会被 Tailwind v4 的扫描器遗漏（purge 掉）。

**2. 颜色传递到客户端 JS**

`ThoughtStream.astro` 用 Astro 的 `is:inline define:vars={{ color }}` 把服务端 prop 注入客户端全局变量，再由 ES module script 读取：
```astro
<script is:inline define:vars={{ color }}>
  window.__streamColor = color;
</script>
<script>
  const color: string = (window as any).__streamColor;
</script>
```

**3. `astro.config.mjs` 有一个 `@ts-ignore`**

`@tailwindcss/vite` 插件与 Astro 内置 Vite 的类型定义有版本冲突，用 `// @ts-ignore` 绕过，运行时完全正常。待上游修复后可移除。

**4. `astro check` 门禁**

每次有变更都应运行 `npm run check`，确保 0 errors。当前通过。

---

## 四、文件结构速查

```
personal-site/
├── astro.config.mjs          Astro 配置（Tailwind vite 插件）
├── src/styles/global.css     Tailwind @import + @theme 品牌色
├── src/lib/                  纯逻辑（TDD），4 个模块 + 测试
│   ├── reading-time.ts       estimateReadingTime(text) → 分钟数
│   ├── rotator.ts            nextIndex(current, length) → 循环索引
│   ├── sort.ts               sortByDateDesc(items, getDate) → 新数组
│   └── filter.ts             matchesFilter(value, active) → bool
├── src/content.config.ts     4 个 content collections 的 schema
├── src/content/              Markdown 内容（当前为占位）
│   ├── products/             type/status/featured/url/tech
│   ├── writing/              topic/publishDate/featured
│   ├── thoughts/             date/tags（短碎想）
│   └── musings/              date/tags（哲思）
├── src/data/
│   ├── site.ts               全站文案、hero、about、身份卡、联系方式
│   ├── sections.ts           5 大板块元数据（slug/label/en/color/tagline）
│   └── play.ts               电影/狼人杀/剧本杀数据
├── src/layouts/
│   ├── BaseLayout.astro      HTML 壳 + Nav + Footer
│   └── ArticleLayout.astro   长文阅读排版
├── src/components/           全部 9 个组件（见下）
└── src/pages/                全部路由（见下）
```

**组件一览：**

| 组件 | 职责 |
|---|---|
| `Nav.astro` | 顶部导航，sticky，当前路由高亮 |
| `Footer.astro` | 页脚，年份 + 联系方式 |
| `HeroRotator.astro` | 首页巨字循环（client `<script>` 用 `nextIndex`）|
| `SectionBlock.astro` | bento 色块（含预览列表），可传 `large` prop 跨 2 列 |
| `ProductCard.astro` | 产品卡（含 `data-type` 筛选 attr、状态徽章、访问按钮）|
| `ArticleListItem.astro` | 写作列表项（featured 变体更大）|
| `ThoughtStream.astro` | 碎想/哲思共用流（color prop 控制主题色）|
| `PlayModule.astro` | 兴趣模块卡（slot 接受任意内容）|
| `IdentityCard.astro` | 🦉 CSS 3D 翻牌身份卡（aria-pressed 控制）|

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
url: https://...   # 可选
tech: ["Astro", "xxx"]
featured: false    # 只有一个设 true（主打作品）
order: 4           # 控制排序，数字小的在前
---
正文（可选，详细介绍）
```

**新增长文：**
```bash
# 新建 src/content/writing/your-article.md
---
title: 文章标题
summary: 摘要（写作列表页显示）
topic: 需求分析     # 用于话题筛选，与其他文章保持一致
publishDate: 2026-06-10
tags: ["方法论"]
featured: false    # 只有一篇设 true（置顶代表作）
---
正文 Markdown...
```

**新增碎想（行业）：**
```bash
# 新建 src/content/thoughts/2026-06-10-your-thought.md
---
date: 2026-06-10
tags: ["#AI"]      # 前缀 # 是惯例，用于筛选显示
---
一句话或几句话的想法。
```

**新增哲思：** 同上，改到 `src/content/musings/`，标签如 `["#哲学"]`。

**更新个人信息：** 编辑 `src/data/site.ts`（联系方式、自述、身份卡内容）。

**更新兴趣内容：** 编辑 `src/data/play.ts`（电影/狼人杀/剧本杀数据）。

**发布流程：**
```bash
git add .
git commit -m "content: 新增xxx"
git push   # Vercel 自动触发重新部署
```

---

## 六、设计规范速查

**品牌色（在 `global.css` @theme 定义，可直接用 Tailwind 工具类）：**

| 板块 | Token | 色值 | 常用类 |
|---|---|---|---|
| 产品 BUILD | `--color-build` | `#2563eb` | `text-build` `bg-build` `border-build` |
| 写作 WRITE | `--color-write` | `#f59e0b` | `text-write` `bg-write` |
| 行业碎想 THINK | `--color-think` | `#10b981` | `text-think` `bg-think` |
| 哲思随笔 MUSE | `--color-muse` | `#7c3aed` | `text-muse` `bg-muse` |
| 玩/兴趣 PLAY | `--color-play` | `#ec4899` | `text-play` `bg-play` |
| 正文 | `--color-ink` | `#111111` | `text-ink` |

**字体：** PingFang SC → Microsoft YaHei → system-ui（中文优先）

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
- `docs/superpowers/plans/2026-06-06-personal-card-website.md` — 12 个任务的实现计划（已全部执行完成）

如需了解某个设计决策的来龙去脉，读上面两份文档。
