/** 计算循环列表的下一个索引；空列表返回 0。 */
export function nextIndex(current: number, length: number): number {
  if (length <= 0) return 0;
  return (current + 1) % length;
}
