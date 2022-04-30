export function strValue(str: string) {
  if (str === 'false') return false
  if (str === 'true') return true

  if (/^\d+(\.\d+)?$/.test(str)) {
    let num = Number(str)

    if (Number.isNaN(num)) return str
    return num
  }
  return str
}
export const strEllipsis = (str: string, len: number, ellipsis = '...') => {
  str += ''
  if (str.length < len) return str
  return str.substring(0, len - ellipsis.length) + ellipsis
}
/**
 *
 * @param str
 * @param template
 * @param len
 * @param prefix 填充的字符是追加到在原字符前面或后面,不传递此参数则只返回填充的字符
 * @returns 返回处理后的字符
 * @example
 * fillStr('x', '00', 5) // '0000'
 * fillStr('x', '00', 5, false) // 'x0000'
 * fillStr('x', '00', 5, true) //'0000x'
 */
export const fillStr = (str: string | number, template: string, len: number, prefix?: boolean) => {
  str += ''
  var s = '',
    fillLen = len - (str as any).length
  while (s.length < fillLen) {
    s += template
  }
  if (prefix !== void 0) {
    return prefix ? s + str : str + s
  }
  return s
}
