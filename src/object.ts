import { trueFn } from '@/common'
import { isNil, isArray, isObject } from './common'
import { PropsType } from './ts-type'

/**
 *
 * @param obj 数组或对象
 * @param fn
 */
export const forEach = <T extends string | number = string, V = any>(
  obj: Record<T, V>,
  fn: (val: V, key: T, obj: Record<T, V>) => void
) => {
  if (isArray(obj)) obj.forEach(fn as any)

  if (isObject(obj)) {
    for (let k in obj) {
      fn(obj[k], k, obj)
    }
  }
}

type DeleteHandler<T> = (key: keyof T, value: T[keyof T], target: T) => boolean
/**
 * 删除对象的部分属性
 * @returns 删除了的对象集合
 * @example
 * let obj = {a: 1, b: 2,c: 3}
 * var dels = deleteProp(obj, (k, v)=> v<3)
 * // dels: {a: 1,b:2}
 * // obj: {c: 3}
 */
export const deleteProp = <T extends Record<any, any>>(obj: T, ...handlers: DeleteHandler<T>[]) => {
  if (!obj || !handlers || !handlers.length) return {}

  let deleted: Partial<T> = {}

  let val
  for (let k in obj) {
    val = obj[k]
    let delRes = handlers.some((h) => h(k, val, obj))
    if (delRes && delete obj[k]) {
      deleted[k] = val
    }
  }
  return deleted
}

export const deleteNilProp = <T extends Record<any, any>>(obj: T): Partial<T> => {
  return deleteProp(obj, (_k, v) => isNil(v))
}

/**
 * 删除无效id属性(key以id结尾), 0 和-1都算无效id
 * @example
 * // id, subId都将被删除
 * deleteInvalidIdProp({id: -1, subId: 0, a: null, vid: 2})
 */
export const deleteInvalidIdProps = <T extends Record<any, any>>(obj): Partial<T> => {
  return deleteProp(obj, (k, v) => {
    if (typeof k == 'symbol') return false

    if ((k + '').toLowerCase().endsWith('id') && !(typeof v == 'number' && (~v as any))) return true

    return false
  })
}

export function assignProp(
  target: Record<any, any>,
  props: Record<any, any>,
  type: 'nil' | 'always' | 'miss' | 'undefined' = 'nil'
) {
  if (!isObject(target)) return target

  const assignCondition =
    type == 'nil'
      ? isNil
      : type == 'miss'
      ? (v, k, obj) => !(k in obj)
      : type == 'always'
      ? trueFn
      : (val) => val === undefined

  let val: any
  for (let k in props) {
    val = target[k]
    if (assignCondition(val, k, target)) {
      target[k] = props[k]
    }
  }

  return target
}

export function objectToArr<T extends Record<any, any>>(obj: T): Array<PropsType<T>>
export function objectToArr<T extends Record<any, any>, V = any>(
  obj: T,
  fn?: (k: string, val: PropsType<T>, obj: T) => V
): V[]
export function objectToArr<T extends Record<any, any>, V = any>(
  obj: T,
  fn?: (k: string, val: PropsType<T>, obj: T) => V
) {
  if (!obj) return []
  let res = []
  if (!fn) fn = (_, v) => v

  for (let k in obj) {
    res.push(fn(k, obj[k], obj))
  }

  return res
}
