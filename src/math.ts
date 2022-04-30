export function rangeLimit(num: number, min: number = -Infinity, max: number = Infinity) {
  if (num < min) return min
  if (num > max) return max
  return num
}
