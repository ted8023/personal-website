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
