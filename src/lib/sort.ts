/** 返回按日期倒序排列的新数组（不修改原数组）。 */
export function sortByDateDesc<T>(items: T[], getDate: (item: T) => Date): T[] {
  return [...items].sort((a, b) => getDate(b).getTime() - getDate(a).getTime());
}
