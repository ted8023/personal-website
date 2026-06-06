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
