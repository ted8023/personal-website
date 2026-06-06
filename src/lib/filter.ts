/** 判断某条目的字段值是否匹配当前激活的筛选项；active 为 'all' 时永远匹配。 */
export function matchesFilter(value: string | string[], active: string): boolean {
  if (active === 'all') return true;
  return Array.isArray(value) ? value.includes(active) : value === active;
}
