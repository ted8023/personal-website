/** 估算中文/英文混合文本的阅读时长（分钟，最少 1）。中文 400 字/分，英文 200 词/分。 */
export function estimateReadingTime(text: string): number {
  const cjk = (text.match(/[一-鿿]/g) || []).length;
  const words = (text.replace(/[一-鿿]/g, ' ').match(/[A-Za-z0-9]+/g) || []).length;
  const minutes = Math.ceil(cjk / 400 + words / 200);
  return Math.max(1, minutes);
}
