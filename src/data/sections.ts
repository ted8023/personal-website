export interface Section {
  slug: string;
  label: string;
  en: string;
  color: string;
  tagline: string;
  accent: string;      // body[data-accent] value
  mhCn: string;        // masthead Chinese subtitle
  mhDesc: string;      // masthead description
  mhMeta: string[];    // masthead tag labels
  footerCopy: string;  // per-page footer copyright text
}

export const sections: Section[] = [
  {
    slug: 'products', label: '产品', en: 'BUILD', color: 'build', tagline: '我做的东西，能点能玩',
    accent: 'blue',
    mhCn: '产品 · 我做的东西',
    mhDesc: '认真到偏执的那一面。从一句话的灵感到能用的东西，我喜欢把复杂的问题收成一个干净的入口。下面是正在长大的几个。',
    mhMeta: ['独立开发', '设计 + 代码'],
    footerCopy: '做东西使我快乐',
  },
  {
    slug: 'writing', label: '写作', en: 'WRITE', color: 'write', tagline: '成体系地聊产品',
    accent: 'orange',
    mhCn: '写作 · 认真写的长文',
    mhDesc: '放松到跑题的那一面。写产品、写设计、写做与不做之间的纠结。能写清楚的，往往才是真的想明白了。',
    mhMeta: ['长文', '每月更', '不蹭热点'],
    footerCopy: '想清楚了才写',
  },
  {
    slug: 'thoughts', label: '行业碎想', en: 'THINK', color: 'think', tagline: '互联网与 AI 的随手观察',
    accent: 'green',
    mhCn: '行业碎想 · 没整理好的判断',
    mhDesc: '瞎想的那一面，但瞎得有据。关于 AI、独立开发、订阅经济的一些短想法——不一定对，但都是真心话。',
    mhMeta: ['短想法', '随时更新', '欢迎抬杠'],
    footerCopy: '不一定对，但都真心',
  },
  {
    slug: 'musings', label: '哲思随笔', en: 'MUSE', color: 'muse', tagline: '哲学 · 心理 · 社会',
    accent: 'purple',
    mhCn: '哲思随笔 · 深夜的自言自语',
    mhDesc: '想得最远的那一面。无关产品、无关效率，只是一个人在深夜里，对时间、无聊和意义的一些不合时宜的发问。',
    mhMeta: ['随笔', '慢更', '深夜限定'],
    footerCopy: '想远一点没坏处',
  },
  {
    slug: 'play', label: '玩 / 兴趣', en: 'PLAY', color: 'play', tagline: '狼人杀 · 电影 · 剧本杀',
    accent: 'pink',
    mhCn: '玩 · 一本正经地不务正业',
    mhDesc: '最放飞的那一面。没有 KPI、没有规划，纯粹因为「好玩」而做的事。会做的人，也得会玩。',
    mhMeta: ['爱好', '随心所欲', '但很快乐'],
    footerCopy: '试试 ↑↑↓↓←→←→ B A',
  },
];
