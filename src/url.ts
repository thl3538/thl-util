import { isNil } from './common'
import { strValue } from './string'

/**
 * 去除地址末尾的符号 `/` 以及`#`
 * @param url string
 */
export function getOrigin(url: string) {
  for (let i = url.length - 1; i >= 0; i--) {
    let cur = url[i]
    if (cur !== '#' && cur !== '/') {
      return url.substr(0, i + 1)
    }
  }
  return url
}
export function joinPath(...paths: string[]) {
  const safeParse = (s) => (s === void 0 ? '' : s + '')
  const trim = (str: string) => {
    var start = 0,
      end = str.length
    if (str[0] == '/') {
      start = 1
    }
    if (str[str.length - 1] == '/') {
      end = str.length - 1
    }
    return str.substring(start, end)
  }
  const frist = safeParse(paths.shift()!)
  let _path = (frist[0] == '/' ? '/' : '') + trim(frist)
  while (paths.length) {
    let s = safeParse(paths.shift())
    let p = trim(s)
    if (!p) continue
    _path += '/' + p
  }
  return _path
}

/**
 * 提取url中的params
 * @param str
 * @example
 * extractQueryStr('a=1&b=2')
 * extractQueryStr('http://192.168.9.31:10086/#/pages/sub_videos/index?topicId=346&name=redis')
 */
export function extractQueryStr(
  str: string,
  convert?: false | ((key: string, val: string, obj: Record<any, any>) => any)
): { [k: string]: string } {
  if (!str) return {}
  let idx = str.indexOf('?')
  if (~idx) {
    str = str.slice(idx + 1)
  }
  let fieldVals = str.split('&')

  let qs = {}
  const _converter =
    convert === false ? (_, v) => v : typeof convert == 'function' ? convert : (_, v, __) => strValue(v)

  fieldVals.forEach((fv) => {
    let len = fv.length
    let key, val
    for (let i = 0; i < len; i++) {
      if (fv[i] === '=') {
        key = fv.slice(0, i)
        val = fv.slice(i + 1)
        qs[key] = _converter(key, decodeURIComponent(val), qs)
        break
      }
    }
  })
  return qs
}
/**
 *
 * @param data 参数对象
 * @param prefix false 或者 字符串前缀,默认为`'?'`
 * @returns query字符串,形如`'?a=1&b=2'`
 */
export function objectToQueryStr(data: Record<any, any>, prefix: false | string = '?') {
  let res: Array<string> = []
  for (let key in data) {
    let value = data[key]
    if (isNil(value)) continue
    res.push(key + '=' + encodeURIComponent(value))
  }
  return res.length ? (prefix || '') + res.join('&') : ''
}
