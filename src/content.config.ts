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
