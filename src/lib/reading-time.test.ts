import { describe, it, expect } from 'vitest';
import { estimateReadingTime } from './reading-time';

describe('estimateReadingTime', () => {
  it('400 个中文字约 1 分钟', () => {
    expect(estimateReadingTime('字'.repeat(400))).toBe(1);
  });
  it('800 个中文字约 2 分钟', () => {
    expect(estimateReadingTime('字'.repeat(800))).toBe(2);
  });
  it('空内容至少 1 分钟', () => {
    expect(estimateReadingTime('')).toBe(1);
  });
  it('英文按词计：400 词约 2 分钟', () => {
    expect(estimateReadingTime(Array(400).fill('word').join(' '))).toBe(2);
  });
});
