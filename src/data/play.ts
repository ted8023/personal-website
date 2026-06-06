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
