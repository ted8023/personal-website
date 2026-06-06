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
