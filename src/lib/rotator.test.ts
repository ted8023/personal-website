import { describe, it, expect } from 'vitest';
import { nextIndex } from './rotator';

describe('nextIndex', () => {
  it('递增', () => expect(nextIndex(0, 4)).toBe(1));
  it('到末尾回环', () => expect(nextIndex(3, 4)).toBe(0));
  it('长度为 0 时返回 0', () => expect(nextIndex(0, 0)).toBe(0));
});
