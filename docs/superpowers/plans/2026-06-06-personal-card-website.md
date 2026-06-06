# 阿秋个人名片网站 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建阿秋的个人名片网站 v1——首页(Hero动效+5鲜艳色块预览)、6个内容页面、Markdown 内容集合、若干趣味彩蛋，响应式并可部署到 Vercel。

**Architecture:** 基于 Astro 5 静态站，内容用 content collections（Markdown）+ 结构化 TS 数据驱动；样式用 Tailwind v4（CSS `@theme` 定义 5 个品牌色）；交互（首页巨字循环、标签筛选、身份卡翻牌）用 Astro 原生 `<script>` 岛 + 纯函数逻辑；纯逻辑用 Vitest 做 TDD，视觉/集成用 `astro build` + `astro check` 把关 + dev server 人工核验。

**Tech Stack:** Astro 5, Tailwind v4 (`@tailwindcss/vite`), TypeScript (strict), Vitest 3, 部署 Vercel (静态)。

**设计依据:** `docs/superpowers/specs/2026-06-06-personal-card-website-design.md`

---

## 测试哲学（先读）

这是一个内容/视觉站，TDD 应用在**可独立验证的纯逻辑**上，视觉用构建门禁 + 人工核验：

- **Vitest 单元测试（TDD）**：阅读时长估算、首页文字循环索引、按日期排序、标签/类型筛选谓词。这些是纯函数，先写失败测试。
- **`astro check`**：校验 content collections 的 schema 与组件类型。
- **`astro build`**：集成门禁，捕获断链、未定义引用、构建错误。
- **dev server 人工核验**：每个页面/交互在 `npm run dev` 下肉眼确认（执行 agent 可用 run/preview 工具截图）。

每个任务末尾都 commit。

---

## 文件结构（先规划，后实现）

```
personal-site/
├── package.json                       # 依赖与脚本
├── astro.config.mjs                   # Astro + tailwind vite 插件
├── tsconfig.json                      # strict
├── vitest.config.ts                   # 单元测试配置
├── README.md                          # 部署说明
├── src/
│   ├── styles/global.css              # Tailwind import + @theme 品牌色
│   ├── lib/                           # 纯逻辑（TDD）
│   │   ├── reading-time.ts
│   │   ├── reading-time.test.ts
│   │   ├── rotator.ts
│   │   ├── rotator.test.ts
│   │   ├── sort.ts
│   │   ├── sort.test.ts
│   │   ├── filter.ts
│   │   └── filter.test.ts
│   ├── content.config.ts              # products/writing/thoughts/musings 集合 schema
│   ├── content/
│   │   ├── products/*.md
│   │   ├── writing/*.md
│   │   ├── thoughts/*.md
│   │   └── musings/*.md
│   ├── data/
│   │   ├── site.ts                    # 站点信息、导航、联系方式、自述、身份卡
│   │   ├── sections.ts                # 5 大板块元数据（色、英文标签、slug）
│   │   └── play.ts                    # 电影/狼人杀/剧本杀 结构化数据
│   ├── layouts/
│   │   ├── BaseLayout.astro           # html 壳 + Nav + Footer
│   │   └── ArticleLayout.astro        # 长文阅读排版
│   ├── components/
│   │   ├── Nav.astro
│   │   ├── Footer.astro
│   │   ├── HeroRotator.astro          # 首页巨字循环（岛）
│   │   ├── SectionBlock.astro         # bento 彩色块
│   │   ├── ProductCard.astro
│   │   ├── ArticleListItem.astro
│   │   ├── ThoughtStream.astro        # 碎想流（thoughts/musings 共用，可换色）
│   │   ├── PlayModule.astro
│   │   └── IdentityCard.astro         # 身份卡翻牌（岛）
│   └── pages/
│       ├── index.astro                # 首页
│       ├── products/index.astro
│       ├── writing/index.astro
│       ├── writing/[slug].astro
│       ├── thoughts/index.astro
│       ├── musings/index.astro
│       ├── play/index.astro
│       ├── about.astro
│       └── 404.astro
└── public/
    └── favicon.svg
```

---

## Task 1: 脚手架（Astro + Tailwind v4 + Vitest）

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `vitest.config.ts`
- Create: `src/styles/global.css`, `src/pages/index.astro`, `public/favicon.svg`

- [ ] **Step 1: 写 `package.json`**

```json
{
  "name": "personal-site",
  "type": "module",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "sync": "astro sync",
    "check": "astro check",
    "test": "vitest run"
  },
  "dependencies": {
    "astro": "^5.6.0"
  },
  "devDependencies": {
    "@astrojs/check": "^0.9.4",
    "@tailwindcss/vite": "^4.0.0",
    "tailwindcss": "^4.0.0",
    "typescript": "^5.6.0",
    "vitest": "^3.0.0"
  }
}
```

- [ ] **Step 2: 写 `astro.config.mjs`**

```js
// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://example.vercel.app',
  vite: {
    plugins: [tailwindcss()],
  },
});
```

- [ ] **Step 3: 写 `tsconfig.json`**

```json
{
  "extends": "astro/tsconfigs/strict",
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist"]
}
```

- [ ] **Step 4: 写 `vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['src/**/*.test.ts'],
    environment: 'node',
  },
});
```

- [ ] **Step 5: 写 `src/styles/global.css`（Tailwind v4 + 品牌色 token）**

```css
@import "tailwindcss";

@theme {
  --color-ink: #111111;
  --color-build: #2563eb;
  --color-write: #f59e0b;
  --color-think: #10b981;
  --color-muse: #7c3aed;
  --color-play: #ec4899;
  --font-sans: "PingFang SC", "Microsoft YaHei", system-ui, -apple-system, "Segoe UI", sans-serif;
}

html { scroll-behavior: smooth; }
body { font-family: var(--font-sans); }
```

- [ ] **Step 6: 写 `public/favicon.svg`**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><text x="2" y="25" font-size="24">🦉</text></svg>
```

- [ ] **Step 7: 写占位首页 `src/pages/index.astro`**

```astro
---
import '../styles/global.css';
---
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="icon" href="/favicon.svg" />
    <title>阿秋</title>
  </head>
  <body class="bg-white text-ink">
    <main class="p-10">
      <h1 class="text-3xl font-extrabold">脚手架就绪 <span class="text-play">.</span></h1>
    </main>
  </body>
</html>
```

- [ ] **Step 8: 安装依赖**

Run: `cd /Users/guolei/personal-site && npm install`
Expected: 安装成功，生成 `node_modules/` 与 `package-lock.json`，无 ERR。

- [ ] **Step 9: 验证构建通过**

Run: `npm run build`
Expected: `dist/` 生成，输出含 `index.html`，无报错。

- [ ] **Step 10: 验证测试运行器可用**

Run: `npm run test`
Expected: Vitest 启动，提示 "No test files found"（此时还没测试），退出码 0。

- [ ] **Step 11: Commit**

```bash
git add package.json package-lock.json astro.config.mjs tsconfig.json vitest.config.ts src public
git commit -m "chore: scaffold Astro 5 + Tailwind v4 + Vitest"
```

---

## Task 2: 核心纯逻辑工具（TDD）

**Files:**
- Create/Test: `src/lib/reading-time.ts` + `src/lib/reading-time.test.ts`
- Create/Test: `src/lib/rotator.ts` + `src/lib/rotator.test.ts`
- Create/Test: `src/lib/sort.ts` + `src/lib/sort.test.ts`
- Create/Test: `src/lib/filter.ts` + `src/lib/filter.test.ts`

- [ ] **Step 1: 写失败测试 `src/lib/reading-time.test.ts`**

```ts
import { describe, it, expect } from 'vitest';
import { estimateReadingTime } from './reading-time';

describe('estimateReadingTime', () => {
  it('400 个中文字约 1 分钟', () => {
    expect(estimateReadingTime('字'.repeat(400))).toBe(1);
  });
  it('800 个中文字约 2 分钟', () => {
    expect(estimateReadingTime('字'.repeat(800))).toBe(2);
  });
  it('空内容至少 1 分钟', () => {
    expect(estimateReadingTime('')).toBe(1);
  });
  it('英文按词计：400 词约 2 分钟', () => {
    expect(estimateReadingTime(Array(400).fill('word').join(' '))).toBe(2);
  });
});
```

- [ ] **Step 2: 运行测试确认失败**

Run: `npx vitest run src/lib/reading-time.test.ts`
Expected: FAIL（`estimateReadingTime` 未定义 / 模块不存在）。

- [ ] **Step 3: 写实现 `src/lib/reading-time.ts`**

```ts
/** 估算中文/英文混合文本的阅读时长（分钟，最少 1）。中文 400 字/分，英文 200 词/分。 */
export function estimateReadingTime(text: string): number {
  const cjk = (text.match(/[一-鿿]/g) || []).length;
  const words = (text.replace(/[一-鿿]/g, ' ').match(/[A-Za-z0-9]+/g) || []).length;
  const minutes = Math.ceil(cjk / 400 + words / 200);
  return Math.max(1, minutes);
}
```

- [ ] **Step 4: 运行测试确认通过**

Run: `npx vitest run src/lib/reading-time.test.ts`
Expected: PASS（4 passed）。

- [ ] **Step 5: 写失败测试 `src/lib/rotator.test.ts`**

```ts
import { describe, it, expect } from 'vitest';
import { nextIndex } from './rotator';

describe('nextIndex', () => {
  it('递增', () => expect(nextIndex(0, 4)).toBe(1));
  it('到末尾回环', () => expect(nextIndex(3, 4)).toBe(0));
  it('长度为 0 时返回 0', () => expect(nextIndex(0, 0)).toBe(0));
});
```

- [ ] **Step 6: 运行确认失败**

Run: `npx vitest run src/lib/rotator.test.ts`
Expected: FAIL。

- [ ] **Step 7: 写实现 `src/lib/rotator.ts`**

```ts
/** 计算循环列表的下一个索引；空列表返回 0。 */
export function nextIndex(current: number, length: number): number {
  if (length <= 0) return 0;
  return (current + 1) % length;
}
```

- [ ] **Step 8: 运行确认通过**

Run: `npx vitest run src/lib/rotator.test.ts`
Expected: PASS。

- [ ] **Step 9: 写失败测试 `src/lib/sort.test.ts`**

```ts
import { describe, it, expect } from 'vitest';
import { sortByDateDesc } from './sort';

describe('sortByDateDesc', () => {
  it('按日期倒序', () => {
    const items = [
      { id: 'a', d: new Date('2026-01-01') },
      { id: 'b', d: new Date('2026-03-01') },
      { id: 'c', d: new Date('2026-02-01') },
    ];
    expect(sortByDateDesc(items, (x) => x.d).map((x) => x.id)).toEqual(['b', 'c', 'a']);
  });
  it('不修改原数组', () => {
    const items = [{ id: 'a', d: new Date('2026-01-01') }];
    const copy = [...items];
    sortByDateDesc(items, (x) => x.d);
    expect(items).toEqual(copy);
  });
});
```

- [ ] **Step 10: 运行确认失败**

Run: `npx vitest run src/lib/sort.test.ts`
Expected: FAIL。

- [ ] **Step 11: 写实现 `src/lib/sort.ts`**

```ts
/** 返回按日期倒序排列的新数组（不修改原数组）。 */
export function sortByDateDesc<T>(items: T[], getDate: (item: T) => Date): T[] {
  return [...items].sort((a, b) => getDate(b).getTime() - getDate(a).getTime());
}
```

- [ ] **Step 12: 运行确认通过**

Run: `npx vitest run src/lib/sort.test.ts`
Expected: PASS。

- [ ] **Step 13: 写失败测试 `src/lib/filter.test.ts`**

```ts
import { describe, it, expect } from 'vitest';
import { matchesFilter } from './filter';

describe('matchesFilter', () => {
  it('all 永远匹配', () => expect(matchesFilter('网站', 'all')).toBe(true));
  it('单值相等匹配', () => expect(matchesFilter('网站', '网站')).toBe(true));
  it('单值不等不匹配', () => expect(matchesFilter('网站', 'App')).toBe(false));
  it('数组包含即匹配', () => expect(matchesFilter(['#AI', '#x'], '#AI')).toBe(true));
  it('数组不包含不匹配', () => expect(matchesFilter(['#AI'], '#社会')).toBe(false));
});
```

- [ ] **Step 14: 运行确认失败**

Run: `npx vitest run src/lib/filter.test.ts`
Expected: FAIL。

- [ ] **Step 15: 写实现 `src/lib/filter.ts`**

```ts
/** 判断某条目的字段值是否匹配当前激活的筛选项；active 为 'all' 时永远匹配。 */
export function matchesFilter(value: string | string[], active: string): boolean {
  if (active === 'all') return true;
  return Array.isArray(value) ? value.includes(active) : value === active;
}
```

- [ ] **Step 16: 运行全部测试确认通过**

Run: `npm run test`
Expected: 4 个测试文件全部 PASS。

- [ ] **Step 17: Commit**

```bash
git add src/lib
git commit -m "feat: add core pure utilities (reading-time, rotator, sort, filter) with tests"
```

---

## Task 3: 内容集合 schema + 示例内容

**Files:**
- Create: `src/content.config.ts`
- Create: `src/content/products/{ai-fit-judge.md, weekly-planner.md, mini-shop.md}`
- Create: `src/content/writing/{requirement-analysis.md, ai-product-thinking.md}`
- Create: `src/content/thoughts/{2026-06-05-llm-moat.md, 2026-06-02-pm-ai.md, 2026-05-28-saas.md}`
- Create: `src/content/musings/{2026-06-04-free-will.md, 2026-05-30-loneliness.md}`

- [ ] **Step 1: 写 `src/content.config.ts`**

```ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const products = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/products' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    type: z.enum(['网站', '小程序', 'App']),
    status: z.enum(['上线中', '开发中', '已下线']),
    url: z.string().url().optional(),
    cover: z.string().optional(),
    tech: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    order: z.number().default(0),
  }),
});

const writing = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/writing' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    topic: z.string(),
    publishDate: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
  }),
});

const fragment = z.object({
  title: z.string().optional(),
  date: z.coerce.date(),
  tags: z.array(z.string()).default([]),
});

const thoughts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/thoughts' }),
  schema: fragment,
});

const musings = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/musings' }),
  schema: fragment,
});

export const collections = { products, writing, thoughts, musings };
```

- [ ] **Step 2: 写示例产品 `src/content/products/ai-fit-judge.md`**

```md
---
title: AI 穿搭评分
summary: 上传一张穿搭照片，AI 给出评分与改进建议的网页应用。
type: 网站
status: 上线中
url: https://example.com/ai-fit-judge
tech: ["Astro", "OpenAI API"]
featured: true
order: 1
---

主打作品的详细介绍占位：它解决了什么问题、怎么做的、有什么亮点。
```

- [ ] **Step 3: 写示例产品 `src/content/products/weekly-planner.md`**

```md
---
title: 一周计划小程序
summary: 帮你把一周要做的事拆成可执行清单的微信小程序。
type: 小程序
status: 上线中
url: https://example.com/weekly-planner
tech: ["微信小程序"]
order: 2
---

占位介绍。
```

- [ ] **Step 4: 写示例产品 `src/content/products/mini-shop.md`**

```md
---
title: 独立卖货 App
summary: 给个人创作者用的轻量卖货 App，正在开发中。
type: App
status: 开发中
tech: ["React Native"]
order: 3
---

占位介绍。
```

- [ ] **Step 5: 写示例长文 `src/content/writing/requirement-analysis.md`**

```md
---
title: 需求分析的第一性原理
summary: 从"用户到底要解决什么问题"出发，重建一套可复用的需求分析框架。
topic: 需求分析
publishDate: 2026-05-20
tags: ["方法论", "需求"]
featured: true
---

## 引子

这是一篇系统性长文的占位正文。真实内容由阿秋之后替换。

需求分析的核心，是分清"用户说的"和"用户要的"。下面展开三个层次……

（此处省略，正文足够长以便阅读时长估算演示。）
```

- [ ] **Step 6: 写示例长文 `src/content/writing/ai-product-thinking.md`**

```md
---
title: AI 产品经理的能力模型
summary: AI 时代的 PM 需要哪些新能力？一份可自查的能力清单。
topic: AI 产品
publishDate: 2026-04-10
tags: ["AI产品", "方法论"]
---

占位正文。AI 产品经理与传统 PM 的差异在于对不确定性的管理……
```

- [ ] **Step 7: 写示例碎想（行业）三条**

`src/content/thoughts/2026-06-05-llm-moat.md`：

```md
---
date: 2026-06-05
tags: ["#AI"]
---

模型本身很难成为护城河，真正的壁垒在数据飞轮和场景嵌入。
```

`src/content/thoughts/2026-06-02-pm-ai.md`：

```md
---
date: 2026-06-02
tags: ["#产品观察"]
---

未来的 PM 不是写 PRD 的人，是定义评测集的人。
```

`src/content/thoughts/2026-05-28-saas.md`：

```md
---
date: 2026-05-28
tags: ["#互联网"]
---

国内 SaaS 难做，本质是客户没有为"省时间"付费的习惯。
```

- [ ] **Step 8: 写示例哲思两条**

`src/content/musings/2026-06-04-free-will.md`：

```md
---
date: 2026-06-04
tags: ["#哲学"]
---

所谓自由意志，也许只是我们对自身算法不可知的浪漫命名。
```

`src/content/musings/2026-05-30-loneliness.md`：

```md
---
date: 2026-05-30
tags: ["#心理"]
---

孤独不是没人陪，是没人懂你此刻在想的那一件具体的事。
```

- [ ] **Step 9: 同步并校验集合类型**

Run: `npx astro sync && npm run build`
Expected: `astro sync` 生成 `.astro/types.d.ts`；build 成功，无 schema 校验错误。

- [ ] **Step 10: Commit**

```bash
git add src/content.config.ts src/content
git commit -m "feat: add content collections schema and sample content"
```

---

## Task 4: 站点数据 + 基础布局（BaseLayout / Nav / Footer）

**Files:**
- Create: `src/data/site.ts`, `src/data/sections.ts`
- Create: `src/components/Nav.astro`, `src/components/Footer.astro`
- Create: `src/layouts/BaseLayout.astro`

- [ ] **Step 1: 写 `src/data/sections.ts`**

```ts
export interface Section {
  slug: string;     // 路由，如 'products'
  label: string;    // 中文名
  en: string;       // 英文标签
  color: string;    // 品牌色 token 名（对应 global.css 的 --color-*）
  tagline: string;  // 一句话
}

export const sections: Section[] = [
  { slug: 'products', label: '产品', en: 'BUILD', color: 'build', tagline: '我做的东西，能点能玩' },
  { slug: 'writing',  label: '写作', en: 'WRITE', color: 'write', tagline: '成体系地聊产品' },
  { slug: 'thoughts', label: '行业碎想', en: 'THINK', color: 'think', tagline: '互联网与 AI 的随手观察' },
  { slug: 'musings',  label: '哲思随笔', en: 'MUSE', color: 'muse', tagline: '哲学 · 心理 · 社会' },
  { slug: 'play',     label: '玩 / 兴趣', en: 'PLAY', color: 'play', tagline: '狼人杀 · 电影 · 剧本杀' },
];
```

- [ ] **Step 2: 写 `src/data/site.ts`**

```ts
export interface ContactLink { label: string; href: string; }

export const site = {
  name: '阿秋',
  title: '阿秋 · 又会做、又会写、还很有趣',
  description: '阿秋的个人名片：vibe coding 作品、产品长文、行业碎想、哲思与生活。',
  hero: {
    greeting: '嗨，我是阿秋 —',
    lead: '我',
    phrases: ['做产品', '写文章', '瞎想', '也很会玩'],
  },
  about: {
    intro:
      '我是阿秋，一个爱折腾的产品经理。白天做产品、写方法论，晚上 vibe coding 造点小东西，剩下的时间用来瞎想和玩。我相信好产品是"想清楚"和"动手做"的乘积。',
    tags: ['爱折腾', '细节控', '爱观察', '话痨'],
  },
  identityCard: {
    emoji: '🦉',
    role: '产品经理',
    skills: ['Vibe Coding', '写作'],
    hobby: ['狼人杀', '电影', '剧本杀'],
    motto: '想清楚，再动手；动了手，再想清楚。',
  },
  contact: [
    { label: '邮箱', href: 'mailto:hi@example.com' },
    { label: 'GitHub', href: 'https://github.com/' },
    { label: '小红书', href: 'https://www.xiaohongshu.com/' },
  ] as ContactLink[],
};
```

- [ ] **Step 3: 写 `src/components/Nav.astro`**

```astro
---
import { sections } from '../data/sections';
import { site } from '../data/site';
const path = Astro.url.pathname;
---
<nav class="sticky top-0 z-50 bg-white/85 backdrop-blur border-b border-neutral-100">
  <div class="mx-auto max-w-5xl px-5 h-14 flex items-center justify-between">
    <a href="/" class="font-extrabold text-lg">{site.name}<span class="text-play">.</span></a>
    <div class="flex gap-4 text-sm text-neutral-600">
      {sections.map((s) => (
        <a
          href={`/${s.slug}`}
          class:list={['hover:text-ink transition-colors', path.startsWith(`/${s.slug}`) && 'text-ink font-semibold']}
        >{s.label}</a>
      ))}
      <a href="/about" class:list={['hover:text-ink transition-colors', path.startsWith('/about') && 'text-ink font-semibold']}>关于</a>
    </div>
  </div>
</nav>
```

- [ ] **Step 4: 写 `src/components/Footer.astro`**

```astro
---
import { site } from '../data/site';
---
<footer class="mt-24 border-t border-neutral-100">
  <div class="mx-auto max-w-5xl px-5 py-10 flex flex-wrap items-center justify-between gap-4 text-sm text-neutral-500">
    <span>© {new Date().getFullYear()} {site.name}</span>
    <div class="flex gap-4">
      {site.contact.map((c) => (
        <a href={c.href} class="hover:text-ink transition-colors">{c.label}</a>
      ))}
    </div>
  </div>
</footer>
```

- [ ] **Step 5: 写 `src/layouts/BaseLayout.astro`**

```astro
---
import '../styles/global.css';
import Nav from '../components/Nav.astro';
import Footer from '../components/Footer.astro';
import { site } from '../data/site';

interface Props { title?: string; description?: string; }
const { title, description } = Astro.props;
---
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="icon" href="/favicon.svg" />
    <title>{title ?? site.title}</title>
    <meta name="description" content={description ?? site.description} />
  </head>
  <body class="bg-white text-ink antialiased">
    <Nav />
    <slot />
    <Footer />
  </body>
</html>
```

- [ ] **Step 6: 临时把首页接入布局以验证（`src/pages/index.astro` 改写）**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---
<BaseLayout>
  <main class="mx-auto max-w-5xl px-5 py-20">
    <h1 class="text-4xl font-extrabold">布局就绪 <span class="text-play">.</span></h1>
  </main>
</BaseLayout>
```

- [ ] **Step 7: 验证构建 + 类型检查**

Run: `npm run build && npm run check`
Expected: build 成功；`astro check` 0 errors。

- [ ] **Step 8: 人工核验导航/页脚**

Run: `npm run dev`（执行 agent 用 run/preview 打开 `http://localhost:4321`）
Expected: 顶部导航显示 5 板块 + 关于、可 hover；底部显示联系方式。

- [ ] **Step 9: Commit**

```bash
git add src/data src/components src/layouts src/pages/index.astro
git commit -m "feat: add site data, base layout, nav and footer"
```

---

## Task 5: SectionBlock 组件 + 首页 bento 分流（带预览）

**Files:**
- Create: `src/components/SectionBlock.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: 写 `src/components/SectionBlock.astro`**

```astro
---
import type { Section } from '../data/sections';
export interface Preview { title: string; meta?: string; }
interface Props { section: Section; previews: Preview[]; large?: boolean; }
const { section, previews, large = false } = Astro.props;
---
<a
  href={`/${section.slug}`}
  style={`background-color: var(--color-${section.color})`}
  class:list={[
    'group relative flex flex-col justify-between rounded-2xl p-5 text-white overflow-hidden',
    'transition-transform duration-200 hover:-translate-y-1 hover:shadow-xl',
    large ? 'sm:col-span-2 min-h-44' : 'min-h-36',
  ]}
>
  <div>
    <div class="text-xs tracking-widest opacity-80">{section.en} ▸</div>
    <div class="mt-1 text-xl font-extrabold">{section.label}</div>
    <div class="text-sm opacity-90">{section.tagline}</div>
  </div>
  <ul class="mt-3 space-y-1 text-sm opacity-95">
    {previews.map((p) => (
      <li class="truncate">· {p.title}{p.meta && <span class="opacity-70"> · {p.meta}</span>}</li>
    ))}
  </ul>
  <span class="mt-3 text-xs font-semibold opacity-90 group-hover:opacity-100">查看全部 ▸</span>
</a>
```

- [ ] **Step 2: 改写首页 `src/pages/index.astro`（先用色块，Hero 下一任务接入）**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import SectionBlock, { type Preview } from '../components/SectionBlock.astro';
import { sections } from '../data/sections';
import { site } from '../data/site';
import { getCollection } from 'astro:content';
import { sortByDateDesc } from '../lib/sort';

const products = (await getCollection('products')).sort((a, b) => a.data.order - b.data.order);
const writing = sortByDateDesc(await getCollection('writing'), (e) => e.data.publishDate);
const thoughts = sortByDateDesc(await getCollection('thoughts'), (e) => e.data.date);
const musings = sortByDateDesc(await getCollection('musings'), (e) => e.data.date);

const previewsBySlug: Record<string, Preview[]> = {
  products: products.slice(0, 3).map((e) => ({ title: e.data.title, meta: e.data.status })),
  writing: writing.slice(0, 2).map((e) => ({ title: e.data.title })),
  thoughts: thoughts.slice(0, 2).map((e) => ({ title: e.body?.slice(0, 18) ?? e.data.title ?? '' })),
  musings: musings.slice(0, 2).map((e) => ({ title: e.body?.slice(0, 18) ?? e.data.title ?? '' })),
  play: [{ title: '电影 · 狼人杀 · 剧本杀' }],
};
---
<BaseLayout>
  <main class="mx-auto max-w-5xl px-5">
    <section class="py-16">
      <p class="text-sm tracking-widest text-neutral-400">{site.hero.greeting}</p>
      <h1 class="mt-2 text-4xl sm:text-5xl font-black">嗨，我是阿秋。</h1>
    </section>
    <section class="grid grid-cols-1 sm:grid-cols-3 gap-3 pb-16">
      {sections.map((s) => (
        <SectionBlock section={s} previews={previewsBySlug[s.slug]} large={s.slug === 'products'} />
      ))}
    </section>
  </main>
</BaseLayout>
```

- [ ] **Step 3: 验证构建**

Run: `npm run build && npm run check`
Expected: 成功，0 错误。

- [ ] **Step 4: 人工核验**

Run: `npm run dev`
Expected: 首页出现 5 个彩色块，颜色分别为蓝/橙/绿/紫/粉；产品块更大跨 2 列；每块显示 2–3 条预览；hover 上浮有阴影；点击跳转到对应（暂为 404 的）路由。

- [ ] **Step 5: Commit**

```bash
git add src/components/SectionBlock.astro src/pages/index.astro
git commit -m "feat: homepage bento color blocks with latest previews"
```

---

## Task 6: HeroRotator 巨字循环（岛）+ 接入首页

**Files:**
- Create: `src/components/HeroRotator.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: 写 `src/components/HeroRotator.astro`**

```astro
---
interface Props { greeting: string; lead: string; phrases: string[]; }
const { greeting, lead, phrases } = Astro.props;
---
<section class="py-20">
  <p class="text-sm tracking-widest text-neutral-400">{greeting}</p>
  <h1 class="mt-3 text-5xl sm:text-6xl font-black leading-tight">
    {lead}<span
      id="hero-rot"
      data-phrases={JSON.stringify(phrases)}
      class="bg-gradient-to-r from-build via-muse to-play bg-clip-text text-transparent"
    >{phrases[0]}</span><span class="inline-block w-1 h-10 sm:h-12 align-[-6px] ml-1 bg-ink animate-pulse"></span>
  </h1>
</section>

<script>
  import { nextIndex } from '../lib/rotator';
  const el = document.getElementById('hero-rot');
  if (el) {
    const phrases: string[] = JSON.parse(el.dataset.phrases ?? '[]');
    let i = 0;
    setInterval(() => {
      i = nextIndex(i, phrases.length);
      el.textContent = phrases[i];
    }, 2200);
  }
</script>
```

> 说明：`from-build via-muse to-play` 为静态类名，Tailwind 可正常检测；旋转逻辑复用已测试的 `nextIndex`。

- [ ] **Step 2: 接入首页（替换 Task 5 里的静态 hero `<section>`）`src/pages/index.astro`**

把第一段 `<section class="py-16">…</section>` 替换为：

```astro
<HeroRotator greeting={site.hero.greeting} lead={site.hero.lead} phrases={site.hero.phrases} />
```

并在 frontmatter 顶部 import 增加：

```astro
import HeroRotator from '../components/HeroRotator.astro';
```

- [ ] **Step 3: 验证构建**

Run: `npm run build && npm run check`
Expected: 成功，0 错误。

- [ ] **Step 4: 人工核验动效**

Run: `npm run dev`
Expected: 首页巨字「我做产品」中"做产品"为渐变色 + 闪烁光标；约每 2.2 秒切换为 写文章 / 瞎想 / 也很会玩 并循环。

- [ ] **Step 5: Commit**

```bash
git add src/components/HeroRotator.astro src/pages/index.astro
git commit -m "feat: animated hero rotator on homepage"
```

---

## Task 7: 产品页（类型筛选 + 主打 + 网格）

**Files:**
- Create: `src/components/ProductCard.astro`
- Create: `src/pages/products/index.astro`

- [ ] **Step 1: 写 `src/components/ProductCard.astro`**

```astro
---
interface Props {
  title: string; summary: string; type: string; status: string;
  url?: string; tech: string[]; featured?: boolean;
}
const { title, summary, type, status, url, tech, featured = false } = Astro.props;
const statusColor = status === '上线中' ? 'bg-green-100 text-green-700'
  : status === '开发中' ? 'bg-amber-100 text-amber-700'
  : 'bg-neutral-100 text-neutral-500';
---
<article
  data-type={type}
  class:list={['rounded-2xl border border-neutral-200 p-5 transition hover:shadow-md', featured && 'sm:col-span-2 border-build/40']}
>
  {featured && <div class="text-xs font-bold text-build">★ 主打作品</div>}
  <h3 class="mt-1 text-lg font-extrabold">{title}</h3>
  <p class="mt-1 text-sm text-neutral-600">{summary}</p>
  <div class="mt-3 flex flex-wrap gap-2 text-xs">
    <span class="rounded bg-neutral-100 px-2 py-0.5">{type}</span>
    {tech.map((t) => <span class="rounded bg-neutral-100 px-2 py-0.5 text-neutral-600">{t}</span>)}
    <span class={`rounded px-2 py-0.5 ${statusColor}`}>● {status}</span>
  </div>
  {url && (
    <a href={url} target="_blank" rel="noopener" class="mt-4 inline-block rounded-lg bg-build px-3 py-1.5 text-sm font-semibold text-white hover:opacity-90">访问 ↗</a>
  )}
</article>
```

- [ ] **Step 2: 写 `src/pages/products/index.astro`**

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import ProductCard from '../../components/ProductCard.astro';
import { getCollection } from 'astro:content';

const all = (await getCollection('products')).sort((a, b) => a.data.order - b.data.order);
const featured = all.filter((p) => p.data.featured);
const rest = all.filter((p) => !p.data.featured);
const ordered = [...featured, ...rest];
const types = ['all', '网站', '小程序', 'App'];
---
<BaseLayout title="产品 · 阿秋">
  <main class="mx-auto max-w-5xl px-5 py-12">
    <h1 class="text-3xl font-black">我做的东西，能点能玩 <span class="text-build">▸</span></h1>
    <div class="mt-5 flex flex-wrap gap-2 text-sm" id="filter-bar">
      {types.map((t) => (
        <button
          data-filter={t}
          class:list={['filter-chip rounded-full px-3 py-1 border', t === 'all' ? 'bg-build text-white border-build' : 'border-neutral-300 text-neutral-600']}
        >{t === 'all' ? '全部' : t}</button>
      ))}
    </div>
    <div id="grid" class="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
      {ordered.map((p) => (
        <ProductCard {...p.data} />
      ))}
    </div>
  </main>
</BaseLayout>

<script>
  import { matchesFilter } from '../../lib/filter';
  const bar = document.getElementById('filter-bar');
  const cards = Array.from(document.querySelectorAll<HTMLElement>('#grid > [data-type]'));
  bar?.addEventListener('click', (e) => {
    const btn = (e.target as HTMLElement).closest<HTMLElement>('.filter-chip');
    if (!btn) return;
    const active = btn.dataset.filter ?? 'all';
    bar.querySelectorAll<HTMLElement>('.filter-chip').forEach((b) => {
      const on = b === btn;
      b.classList.toggle('bg-build', on);
      b.classList.toggle('text-white', on);
      b.classList.toggle('border-build', on);
      b.classList.toggle('text-neutral-600', !on);
      b.classList.toggle('border-neutral-300', !on);
    });
    cards.forEach((c) => {
      c.style.display = matchesFilter(c.dataset.type ?? '', active) ? '' : 'none';
    });
  });
</script>
```

- [ ] **Step 3: 验证构建 + 类型检查**

Run: `npm run build && npm run check`
Expected: 成功，0 错误。

- [ ] **Step 4: 人工核验**

Run: `npm run dev`，访问 `/products`
Expected: 主打作品大卡跨 2 列、带 ★ 与访问按钮；点筛选「小程序/App/网站」只显示对应类型，「全部」恢复；状态标签颜色正确。

- [ ] **Step 5: Commit**

```bash
git add src/components/ProductCard.astro src/pages/products
git commit -m "feat: products page with type filter, featured and status"
```

---

## Task 8: 写作页 + 文章详情页

**Files:**
- Create: `src/components/ArticleListItem.astro`
- Create: `src/layouts/ArticleLayout.astro`
- Create: `src/pages/writing/index.astro`
- Create: `src/pages/writing/[slug].astro`

- [ ] **Step 1: 写 `src/components/ArticleListItem.astro`**

```astro
---
interface Props { href: string; title: string; summary?: string; meta: string; tag?: string; featured?: boolean; }
const { href, title, summary, meta, tag, featured = false } = Astro.props;
---
<a href={href} class:list={['block py-4 transition hover:opacity-80', !featured && 'border-b border-neutral-100']}>
  {featured && <div class="text-xs font-bold text-write">★ 置顶 / 代表作</div>}
  <div class="flex items-baseline justify-between gap-4">
    <h3 class:list={[featured ? 'text-xl' : 'text-base', 'font-bold']}>{title}</h3>
    <span class="shrink-0 text-xs text-neutral-400">{meta}</span>
  </div>
  {summary && <p class="mt-1 text-sm text-neutral-600">{summary}</p>}
  {tag && <span class="mt-1 inline-block text-xs text-neutral-400">#{tag}</span>}
</a>
```

- [ ] **Step 2: 写 `src/layouts/ArticleLayout.astro`**

```astro
---
import BaseLayout from './BaseLayout.astro';
interface Props { title: string; meta: string; }
const { title, meta } = Astro.props;
---
<BaseLayout title={`${title} · 阿秋`}>
  <main class="mx-auto max-w-2xl px-5 py-12">
    <a href="/writing" class="text-sm text-neutral-400 hover:text-ink">← 返回写作</a>
    <h1 class="mt-4 text-3xl font-black leading-snug">{title}</h1>
    <p class="mt-2 text-sm text-neutral-400">{meta}</p>
    <article class="prose-content mt-8 leading-8 text-neutral-800 [&>h2]:mt-8 [&>h2]:text-xl [&>h2]:font-bold [&>p]:mt-4">
      <slot />
    </article>
  </main>
</BaseLayout>
```

- [ ] **Step 3: 写 `src/pages/writing/index.astro`**

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import ArticleListItem from '../../components/ArticleListItem.astro';
import { getCollection } from 'astro:content';
import { sortByDateDesc } from '../../lib/sort';

const posts = sortByDateDesc(await getCollection('writing'), (e) => e.data.publishDate);
const featured = posts.find((p) => p.data.featured) ?? posts[0];
const rest = posts.filter((p) => p.id !== featured?.id);
const fmt = (d: Date) => `${d.getFullYear()}·${String(d.getMonth() + 1).padStart(2, '0')}`;
const topics = ['all', ...new Set(posts.map((p) => p.data.topic))];
---
<BaseLayout title="写作 · 阿秋">
  <main class="mx-auto max-w-3xl px-5 py-12">
    <h1 class="text-3xl font-black">成体系地聊产品 <span class="text-write">▸</span></h1>
    <div class="mt-5 flex flex-wrap gap-2 text-sm" id="topic-bar">
      {topics.map((t) => (
        <button data-filter={t} class:list={['filter-chip rounded-full px-3 py-1 border', t === 'all' ? 'bg-write text-white border-write' : 'border-neutral-300 text-neutral-600']}>
          {t === 'all' ? '全部' : t}
        </button>
      ))}
    </div>

    {featured && (
      <div data-topic={featured.data.topic} class="article-row mt-6 rounded-2xl border border-write/30 p-5">
        <ArticleListItem href={`/writing/${featured.id}`} title={featured.data.title} summary={featured.data.summary} meta={`${fmt(featured.data.publishDate)} · #${featured.data.topic}`} featured={true} />
      </div>
    )}

    <div id="list" class="mt-2">
      {rest.map((p) => (
        <div data-topic={p.data.topic} class="article-row">
          <ArticleListItem href={`/writing/${p.id}`} title={p.data.title} meta={`${fmt(p.data.publishDate)} · #${p.data.topic}`} />
        </div>
      ))}
    </div>
  </main>
</BaseLayout>

<script>
  import { matchesFilter } from '../../lib/filter';
  const bar = document.getElementById('topic-bar');
  const rows = Array.from(document.querySelectorAll<HTMLElement>('.article-row'));
  bar?.addEventListener('click', (e) => {
    const btn = (e.target as HTMLElement).closest<HTMLElement>('.filter-chip');
    if (!btn) return;
    const active = btn.dataset.filter ?? 'all';
    bar.querySelectorAll<HTMLElement>('.filter-chip').forEach((b) => {
      const on = b === btn;
      b.classList.toggle('bg-write', on);
      b.classList.toggle('text-white', on);
      b.classList.toggle('border-write', on);
      b.classList.toggle('text-neutral-600', !on);
      b.classList.toggle('border-neutral-300', !on);
    });
    rows.forEach((r) => { r.style.display = matchesFilter(r.dataset.topic ?? '', active) ? '' : 'none'; });
  });
</script>
```

- [ ] **Step 4: 写 `src/pages/writing/[slug].astro`**

```astro
---
import ArticleLayout from '../../layouts/ArticleLayout.astro';
import { getCollection, render } from 'astro:content';
import { estimateReadingTime } from '../../lib/reading-time';

export async function getStaticPaths() {
  const posts = await getCollection('writing');
  return posts.map((post) => ({ params: { slug: post.id }, props: { post } }));
}
const { post } = Astro.props;
const { Content } = await render(post);
const minutes = estimateReadingTime(post.body ?? '');
const d = post.data.publishDate;
const meta = `${d.getFullYear()}·${String(d.getMonth() + 1).padStart(2, '0')} · 阅读约 ${minutes} 分钟 · #${post.data.topic}`;
---
<ArticleLayout title={post.data.title} meta={meta}>
  <Content />
</ArticleLayout>
```

- [ ] **Step 5: 验证构建 + 类型检查**

Run: `npm run build && npm run check`
Expected: 成功；`/writing` 与各 `/writing/<slug>` 静态页均生成，0 错误。

- [ ] **Step 6: 人工核验**

Run: `npm run dev`，访问 `/writing`
Expected: 置顶代表作大卡 + 话题筛选可用；点标题进入详情页，显示标题、阅读时长、正文排版舒适；详情页"← 返回写作"可用。

- [ ] **Step 7: Commit**

```bash
git add src/components/ArticleListItem.astro src/layouts/ArticleLayout.astro src/pages/writing
git commit -m "feat: writing list with topic filter and article detail pages"
```

---

## Task 9: 碎想流（thoughts / musings 共用组件）

**Files:**
- Create: `src/components/ThoughtStream.astro`
- Create: `src/pages/thoughts/index.astro`
- Create: `src/pages/musings/index.astro`

- [ ] **Step 1: 写 `src/components/ThoughtStream.astro`**

```astro
---
export interface ThoughtItem { date: Date; tags: string[]; body: string; }
interface Props { title: string; color: string; items: ThoughtItem[]; }
const { title, color, items } = Astro.props;
const allTags = ['all', ...new Set(items.flatMap((i) => i.tags))];
const fmt = (d: Date) => `${d.getFullYear()}·${String(d.getMonth() + 1).padStart(2, '0')}·${String(d.getDate()).padStart(2, '0')}`;
---
<main class="mx-auto max-w-2xl px-5 py-12">
  <h1 class="text-3xl font-black">{title} <span style={`color: var(--color-${color})`}>▸</span></h1>
  <div class="mt-5 flex flex-wrap gap-2 text-sm" id="tag-bar">
    {allTags.map((t) => (
      <button
        data-filter={t}
        style={t === 'all' ? `background-color: var(--color-${color}); border-color: var(--color-${color})` : ''}
        class:list={['tag-chip rounded-full px-3 py-1 border', t === 'all' ? 'text-white' : 'border-neutral-300 text-neutral-600']}
      >{t === 'all' ? '全部' : t}</button>
    ))}
  </div>
  <div id="stream" class="mt-8 space-y-6">
    {items.map((i) => (
      <div class="thought-row pl-4" data-tags={JSON.stringify(i.tags)} style={`border-left: 2px solid var(--color-${color})`}>
        <div class="text-xs text-neutral-400">{fmt(i.date)} · {i.tags.join(' ')}</div>
        <p class="mt-1 leading-7">{i.body}</p>
      </div>
    ))}
  </div>
</main>

<script is:inline define:vars={{ color }}>
  // 把主题色传给客户端脚本（用于切换激活 chip 的样式）
  window.__streamColor = color;
</script>
<script>
  import { matchesFilter } from '../lib/filter';
  const color: string = (window as any).__streamColor;
  const bar = document.getElementById('tag-bar');
  const rows = Array.from(document.querySelectorAll<HTMLElement>('.thought-row'));
  bar?.addEventListener('click', (e) => {
    const btn = (e.target as HTMLElement).closest<HTMLElement>('.tag-chip');
    if (!btn) return;
    const active = btn.dataset.filter ?? 'all';
    bar.querySelectorAll<HTMLElement>('.tag-chip').forEach((b) => {
      const on = b === btn;
      b.style.backgroundColor = on ? `var(--color-${color})` : '';
      b.style.borderColor = on ? `var(--color-${color})` : '';
      b.classList.toggle('text-white', on);
      b.classList.toggle('text-neutral-600', !on);
      b.classList.toggle('border-neutral-300', !on);
    });
    rows.forEach((r) => {
      const tags: string[] = JSON.parse(r.dataset.tags ?? '[]');
      r.style.display = matchesFilter(tags, active) ? '' : 'none';
    });
  });
</script>
```

- [ ] **Step 2: 写 `src/pages/thoughts/index.astro`**

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import ThoughtStream from '../../components/ThoughtStream.astro';
import { getCollection } from 'astro:content';
import { sortByDateDesc } from '../../lib/sort';

const entries = sortByDateDesc(await getCollection('thoughts'), (e) => e.data.date);
const items = entries.map((e) => ({ date: e.data.date, tags: e.data.tags, body: e.body ?? '' }));
---
<BaseLayout title="行业碎想 · 阿秋">
  <ThoughtStream title="行业碎想" color="think" items={items} />
</BaseLayout>
```

- [ ] **Step 3: 写 `src/pages/musings/index.astro`**

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import ThoughtStream from '../../components/ThoughtStream.astro';
import { getCollection } from 'astro:content';
import { sortByDateDesc } from '../../lib/sort';

const entries = sortByDateDesc(await getCollection('musings'), (e) => e.data.date);
const items = entries.map((e) => ({ date: e.data.date, tags: e.data.tags, body: e.body ?? '' }));
---
<BaseLayout title="哲思随笔 · 阿秋">
  <ThoughtStream title="哲思随笔" color="muse" items={items} />
</BaseLayout>
```

- [ ] **Step 4: 验证构建 + 类型检查**

Run: `npm run build && npm run check`
Expected: 成功，0 错误。

- [ ] **Step 5: 人工核验**

Run: `npm run dev`，访问 `/thoughts`（绿）与 `/musings`（紫）
Expected: 两页布局一致仅主题色不同；时间倒序；点标签筛选只显示含该标签的条目；激活 chip 变为对应主题色。

- [ ] **Step 6: Commit**

```bash
git add src/components/ThoughtStream.astro src/pages/thoughts src/pages/musings
git commit -m "feat: shared thought stream for thoughts and musings with tag filter"
```

---

## Task 10: 玩 / 兴趣页

**Files:**
- Create: `src/data/play.ts`
- Create: `src/components/PlayModule.astro`
- Create: `src/pages/play/index.astro`

- [ ] **Step 1: 写 `src/data/play.ts`**

```ts
export interface Movie { title: string; rating: number; note: string; }
export interface PlayData {
  movies: Movie[];
  werewolf: { role: string; style: string; highlights: string[] };
  scriptMurder: { played: string[]; recommend: string[]; wishlist: string[] };
}

export const play: PlayData = {
  movies: [
    { title: '银翼杀手 2049', rating: 5, note: '视听与孤独感的极致。' },
    { title: '瞬息全宇宙', rating: 4, note: '混乱但动人。' },
    { title: '健听女孩', rating: 4, note: '简单的好哭。' },
  ],
  werewolf: {
    role: '预言家',
    style: '悍跳狂魔，喜欢第一个站出来。',
    highlights: ['一局四爆狼坑', '残局心理战翻盘'],
  },
  scriptMurder: {
    played: ['年轮', '古木吟', '默杀'],
    recommend: ['年轮（情感本天花板）'],
    wishlist: ['漫长的告别'],
  },
};
```

- [ ] **Step 2: 写 `src/components/PlayModule.astro`**

```astro
---
interface Props { icon: string; title: string; }
const { icon, title } = Astro.props;
---
<section class="rounded-2xl border border-neutral-200 p-5 transition hover:shadow-md hover:-translate-y-0.5">
  <h2 class="text-lg font-extrabold">{icon} {title}</h2>
  <div class="mt-3 text-sm text-neutral-700 space-y-1">
    <slot />
  </div>
</section>
```

- [ ] **Step 3: 写 `src/pages/play/index.astro`**

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import PlayModule from '../../components/PlayModule.astro';
import { play } from '../../data/play';
const stars = (n: number) => '★'.repeat(n) + '☆'.repeat(5 - n);
---
<BaseLayout title="玩 / 兴趣 · 阿秋">
  <main class="mx-auto max-w-5xl px-5 py-12">
    <h1 class="text-3xl font-black">不务正业的那一面 <span class="text-play">▸</span></h1>
    <div class="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
      <PlayModule icon="🎬" title="电影">
        {play.movies.map((m) => (
          <div class="border-b border-neutral-100 pb-2">
            <div class="font-semibold">{m.title} <span class="text-play">{stars(m.rating)}</span></div>
            <div class="text-neutral-500 text-xs">{m.note}</div>
          </div>
        ))}
      </PlayModule>

      <PlayModule icon="🐺" title="狼人杀">
        <div>爱用身份：<b>{play.werewolf.role}</b></div>
        <div>风格：{play.werewolf.style}</div>
        <div class="mt-1 text-neutral-500 text-xs">名场面：{play.werewolf.highlights.join('；')}</div>
      </PlayModule>

      <PlayModule icon="🎭" title="剧本杀">
        <div>玩过：{play.scriptMurder.played.join('、')}</div>
        <div>私藏推荐：{play.scriptMurder.recommend.join('、')}</div>
        <div class="text-neutral-500 text-xs">想开的本：{play.scriptMurder.wishlist.join('、')}</div>
      </PlayModule>
    </div>
  </main>
</BaseLayout>
```

- [ ] **Step 4: 验证构建 + 类型检查**

Run: `npm run build && npm run check`
Expected: 成功，0 错误。

- [ ] **Step 5: 人工核验**

Run: `npm run dev`，访问 `/play`
Expected: 三个模块（电影/狼人杀/剧本杀）呈三列卡片，电影含星级；hover 上浮。

- [ ] **Step 6: Commit**

```bash
git add src/data/play.ts src/components/PlayModule.astro src/pages/play
git commit -m "feat: play page with movies, werewolf and script murder modules"
```

---

## Task 11: 关于页 + 身份卡翻牌（彩蛋）

**Files:**
- Create: `src/components/IdentityCard.astro`
- Create: `src/pages/about.astro`

- [ ] **Step 1: 写 `src/components/IdentityCard.astro`（CSS 3D 翻牌）**

```astro
---
import { site } from '../data/site';
const c = site.identityCard;
---
<button id="id-card" class="id-card group" aria-pressed="false" aria-label="翻看阿秋的身份卡">
  <div class="id-inner">
    <div class="id-face id-front">
      <div class="text-5xl">{c.emoji}</div>
      <div class="mt-2 text-sm font-bold tracking-wide">阿 秋</div>
      <div class="mt-1 text-[11px] text-amber-600">▸ 点击翻牌</div>
    </div>
    <div class="id-face id-back">
      <div class="text-[10px] tracking-widest text-amber-600">IDENTITY CARD</div>
      <div class="mt-1 text-xs leading-5 text-left">
        职业：{c.role}<br />
        技能：{c.skills.join(' / ')}<br />
        癖好：{c.hobby.join(' · ')}
      </div>
      <div class="mt-2 text-[10px] italic text-neutral-500">「{c.motto}」</div>
    </div>
  </div>
</button>

<style>
  .id-card { width: 150px; height: 200px; perspective: 1000px; background: none; border: none; cursor: pointer; }
  .id-inner { position: relative; width: 100%; height: 100%; transition: transform .6s; transform-style: preserve-3d; }
  .id-card[aria-pressed="true"] .id-inner { transform: rotateY(180deg); }
  .id-face {
    position: absolute; inset: 0; backface-visibility: hidden;
    border: 1.5px solid #d4af37; border-radius: 14px;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    padding: 14px; background: linear-gradient(160deg, #fffdf5, #fff7e6);
  }
  .id-back { transform: rotateY(180deg); }
</style>

<script>
  const card = document.getElementById('id-card');
  card?.addEventListener('click', () => {
    const flipped = card.getAttribute('aria-pressed') === 'true';
    card.setAttribute('aria-pressed', String(!flipped));
  });
</script>
```

- [ ] **Step 2: 写 `src/pages/about.astro`**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import IdentityCard from '../components/IdentityCard.astro';
import { site } from '../data/site';
---
<BaseLayout title="关于 · 阿秋">
  <main class="mx-auto max-w-3xl px-5 py-12">
    <h1 class="text-3xl font-black">关于阿秋 <span class="text-neutral-300">▸</span></h1>
    <div class="mt-8 flex flex-col sm:flex-row gap-8 items-start">
      <div class="shrink-0"><IdentityCard /></div>
      <div>
        <p class="leading-8 text-neutral-800">{site.about.intro}</p>
        <div class="mt-4 flex flex-wrap gap-2">
          {site.about.tags.map((t) => (
            <span class="rounded-full bg-neutral-100 px-3 py-1 text-sm text-neutral-700">{t}</span>
          ))}
        </div>
        <div class="mt-6 flex flex-wrap gap-4 text-sm">
          {site.contact.map((c) => (
            <a href={c.href} class="font-semibold text-build hover:underline">{c.label} ↗</a>
          ))}
        </div>
      </div>
    </div>
  </main>
</BaseLayout>
```

- [ ] **Step 3: 验证构建 + 类型检查**

Run: `npm run build && npm run check`
Expected: 成功，0 错误。

- [ ] **Step 4: 人工核验翻牌**

Run: `npm run dev`，访问 `/about`
Expected: 显示自述、性格标签、联系方式；点击 🦉 身份卡有 3D 翻转，背面显示职业/技能/癖好/座右铭；再点翻回。

- [ ] **Step 5: Commit**

```bash
git add src/components/IdentityCard.astro src/pages/about.astro
git commit -m "feat: about page with flip identity card easter egg"
```

---

## Task 12: 趣味 404 + 响应式收尾 + 部署说明

**Files:**
- Create: `src/pages/404.astro`
- Create: `README.md`
- Modify（如需）: 各页面响应式微调

- [ ] **Step 1: 写 `src/pages/404.astro`**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---
<BaseLayout title="迷路了 · 阿秋">
  <main class="mx-auto max-w-2xl px-5 py-24 text-center">
    <div class="text-6xl">🦉</div>
    <h1 class="mt-4 text-3xl font-black">这页不在场，被刀了。</h1>
    <p class="mt-3 text-neutral-500">你来到一个不存在的房间（404）。要不回首页重新组局？</p>
    <a href="/" class="mt-6 inline-block rounded-lg bg-play px-4 py-2 font-semibold text-white hover:opacity-90">回首页 ▸</a>
  </main>
</BaseLayout>
```

- [ ] **Step 2: 写 `README.md`（部署说明）**

```md
# 阿秋的个人名片网站

Astro 5 + Tailwind v4 静态站。

## 本地开发
```bash
npm install
npm run dev      # http://localhost:4321
```

## 构建 / 校验 / 测试
```bash
npm run build    # 输出到 dist/
npm run check    # astro check 类型校验
npm run test     # vitest 单元测试
```

## 更新内容
- 作品：在 `src/content/products/` 新增 `.md`
- 长文：在 `src/content/writing/` 新增 `.md`
- 行业碎想 / 哲思：在 `src/content/thoughts/` 或 `src/content/musings/` 新增 `.md`
- 兴趣 / 联系方式 / 自述：编辑 `src/data/play.ts` 与 `src/data/site.ts`

## 部署到 Vercel
1. 推送到 GitHub。
2. 在 Vercel 选择该仓库，框架自动识别为 Astro（Build: `astro build`，Output: `dist`）。
3. 首发用 Vercel 免费子域名；之后可在 Project Settings → Domains 绑定自定义域名。
```

- [ ] **Step 3: 全站响应式自检（窄屏）**

Run: `npm run dev`，在浏览器把视口缩到 ~375px 逐页查看（首页/产品/写作/碎想/玩/关于/404）
Expected: 首页色块从 3 列降为 1 列；导航不溢出；卡片不横向滚动；巨字不撑破屏幕。若某页溢出，用 Tailwind 响应式类（如把 `sm:grid-cols-3` 配合 `grid-cols-1`）修正后再继续。

- [ ] **Step 4: 全量门禁**

Run: `npm run test && npm run check && npm run build`
Expected: 测试全过；check 0 错误；build 成功，`dist/` 含 `index.html`、各子页与 `404.html`。

- [ ] **Step 5: Commit**

```bash
git add src/pages/404.astro README.md src
git commit -m "feat: fun 404 page, responsive polish and deploy README"
```

---

## Self-Review 结果（已核对设计文档）

**Spec 覆盖检查：**
- 定位/受众/中文+英文术语 → Task 4 `site.ts`、各页面文案 ✅
- 视觉：留白底 + 鲜艳色块 + 品牌色 → Task 1 `global.css` `@theme`、Task 5 `SectionBlock` ✅
- 信息架构：混合枢纽 + 首页预览 + 6 页面 + 浅层导航 → Task 4 Nav、Task 5 首页预览、Task 6–11 各页 ✅
- 首页：巨字循环 + 5 色块（不暴露细节，仅分类名/标签/预览）→ Task 6 HeroRotator、Task 5 SectionBlock（预览仅标题/状态）✅
- 产品页：类型筛选 + 主打 + 状态 + 网格 → Task 7 ✅
- 写作页 + 详情：话题筛选 + 置顶 + 阅读时长 → Task 8 ✅
- 碎想/哲思：共用流 + 换色 + 标签筛选 → Task 9 ✅
- 玩：电影/狼人杀/剧本杀模块 → Task 10 ✅
- 关于：自述 + 标签 + 联系方式 + 身份卡翻牌 → Task 11 ✅
- 趣味层：巨字动效(T6)、色块 hover(T5)、身份卡翻牌(T11)、趣味 404(T12) ✅
- 技术：Astro + content collections + Markdown 更新 + Vercel → Task 1/3/12 ✅
- v1 占位内容 → Task 3 ✅；终端模式彩蛋明确不在范围（v1.5）✅

**占位符扫描：** 无 TBD/TODO；每个代码步骤含完整可运行代码。

**类型一致性：** `Section`(slug/label/en/color/tagline)、`Preview`(title/meta)、`ThoughtItem`(date/tags/body)、`matchesFilter`/`nextIndex`/`sortByDateDesc`/`estimateReadingTime` 在定义与调用处签名一致；色块取色统一用 `var(--color-${color})` 内联样式（避免 Tailwind 动态类被 purge）。

**已知务实取舍：** 自动化测试聚焦纯逻辑（Vitest），视觉/交互用 build+check 门禁 + dev server 人工核验，未引入 e2e（YAGNI）。
