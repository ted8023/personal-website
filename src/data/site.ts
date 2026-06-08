export interface ContactLink { label: string; href: string; }
export interface IdentityCardItem {
  rc: string;       // CSS color class, e.g. 'rc-blue'
  emoji: string;
  en: string;       // English label on front
  role: string;     // Chinese role name on back
  desc: string;     // Back card description
}

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
    lede: '做产品的人，偶尔写字，顺带折腾代码。喜欢把想法做成可以点击的东西，也喜欢把想清楚的事写出来。这里是我的一张名片，有五个房间，欢迎逛逛。这六张牌，是我此刻的六个身份，<b>悬停翻牌看背面</b>。',
    tags: ['爱折腾', '细节控', '爱观察', '话痨'],
    facts: ['📍 中国', '🌙 夜猫子', '☕ 美式依赖者', '🐺 狼人杀预言家', '⌨️ 机械键盘控', '📚 年读 12 本'],
  },
  identityCards: [
    {
      rc: 'rc-blue',
      emoji: '🗂️', en: 'PRODUCT',
      role: '产品经理',
      desc: '把模糊的需求变成可用的东西，是我最喜欢的一种思维训练。',
    },
    {
      rc: 'rc-green',
      emoji: '💻', en: 'CODER',
      role: '独立开发者',
      desc: 'Vibe Coding：先有想法，再学技术。目前主要靠 AI 撑着。',
    },
    {
      rc: 'rc-orange',
      emoji: '✍️', en: 'WRITER',
      role: '写作者',
      desc: '写长文、写碎想、写深夜想不通的问题。文字是最慢的思维工具。',
    },
    {
      rc: 'rc-purple',
      emoji: '🌙', en: 'THINKER',
      role: '哲思者',
      desc: '爱在深夜问"存在的意义"，然后一无所获地睡去。',
    },
    {
      rc: 'rc-pink',
      emoji: '🐺', en: 'PLAYER',
      role: '玩家',
      desc: '狼人杀爱好者，剧本杀探索者，电影收藏家。',
    },
    {
      rc: 'rc-ink',
      emoji: '🦉', en: 'AQIU',
      role: '阿秋',
      desc: '以上皆是，以上皆不完整。你好！',
    },
  ] as IdentityCardItem[],
  contact: [
    { label: '邮箱', href: 'mailto:hi@example.com' },
    { label: 'GitHub', href: 'https://github.com/' },
    { label: '小红书', href: 'https://www.xiaohongshu.com/' },
  ] as ContactLink[],
};
