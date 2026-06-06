import { describe, it, expect } from 'vitest';
import { matchesFilter } from './filter';

describe('matchesFilter', () => {
  it('all 永远匹配', () => expect(matchesFilter('网站', 'all')).toBe(true));
  it('单值相等匹配', () => expect(matchesFilter('网站', '网站')).toBe(true));
  it('单值不等不匹配', () => expect(matchesFilter('网站', 'App')).toBe(false));
  it('数组包含即匹配', () => expect(matchesFilter(['#AI', '#x'], '#AI')).toBe(true));
  it('数组不包含不匹配', () => expect(matchesFilter(['#AI'], '#社会')).toBe(false));
});
