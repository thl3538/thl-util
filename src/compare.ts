import { isArray, isObject } from './common'

export const equal = (a, b) => {
  if (isArray(a) && isArray(b)) {
    return a.every((v, i) => equal(v, b[i])) && b.length == a.length
  } else if (isObject(a) && isObject(b)) {
    if (isArray(a) || isArray(b)) return false
    let aks = Object.keys(a)
    let bks = Object.keys(b)
    return aks.every((ak) => equal(a[ak], b[ak])) && aks.length == bks.length
  }
  return Object.is(a, b)
}
/**
 * a,b是否部分属性相等,默认使用`Object.is`浅比较
 * @returns
 */
export const matchProps = (a: Record<any, any>, b: Record<any, any>, props: string[], deep?: boolean) => {
  const eq = deep ? equal : Object.is
  if (!isObject(a) || !isObject(b)) {
    return Object.is(a, b)
  }
  for (let i = 0, len = props.length; i < len; i++) {
    let prop = props[i]
    if (!eq(a[prop], b[prop])) {
      return false
    }
  }
  return true
}
