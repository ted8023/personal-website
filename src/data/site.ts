export interface ContactLink { label: string; href: string; }

export const site = {
  name: '阿秋',
  title: '阿秋 · 不改变世界',
  description: '阿秋的个人名片：vibe coding 作品、产品长文、行业碎想、哲思与生活。',
  hero: {
    lead: '',
    phrases: ['Vibe Coding', 'Vibe Writing', 'Just Vibing!'],
    // 状态行（绿点旁边的小字）
    status: '此刻在线 · 一个爱折腾的产品人',
    // Hero 副文案（h1 下方段落，支持 HTML <b> 加粗）
    sub: '你好，我是阿秋。自己做产品，写东西，剩下的时间用来<b>瞎想和瞎玩</b>。这张名片把这几件事一次摊开给你看。',
    // CTA 按钮文字
    cta: { primary: '看我做的东西 →', secondary: '关于我（有彩蛋）' },
  },
  about: {
    intro:
      '我是阿秋，一个爱折腾的产品经理。做产品、写文章，vibe coding 造点小东西，剩下的时间用来瞎想和玩。我相信好产品是"想清楚"和"认真做"的乘积。',
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
