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
