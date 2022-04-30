import { AnyFn } from './ts-type'

export const hasOwnProp = (obj: any, prop: string) => {
  return Object.prototype.hasOwnProperty.call(obj, prop)
}
export const hasProp = (obj: any, prop: string) => {
  return prop in obj
}
export const hasProps = (obj: any, props: string[]) => {
  for (let i = 0, len = props.length; i < len; i++) {
    if (!(props[i] in obj)) return false
  }
  return true
}
export const safeExtends = (a: Record<any, any>, b: Record<any, any>) => {
  for (let k in b) {
    if (hasOwnProp(a, k)) continue
    a[k] = b[k]
  }
  return a
}
export const applyOption = (target, ...optionArgs: Record<any, any>[]) => {
  optionArgs.forEach((options) => {
    for (let k in options) {
      let prop = options[k]

      if (hasOwnProp(target, k) && typeof prop == 'object' && prop) {
        applyOption(target[k], options[k])
      } else {
        target[k] = options[k]
      }
    }
  })
  return target
}
export const isNil = (a: any): a is null | undefined => {
  return a == null
}

export const noop = () => {}
export function getProp<T = Record<any, any>>(obj: T, prop: string | string[]) {
  let keys = typeof prop == 'string' ? prop.split('.') : prop
  if (!isObject(obj)) return

  let cur: any = obj
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
    if (!isObject(cur) || !hasOwnProp(cur, key as string)) return undefined
    cur = cur[key as string]
  }
  return cur
}
/**
 * 安全调用一个函数
 * @param fn 如果他是一个函数,将被调用
 * @param args 供函数调用的参数数组
 * @example
 * ``` js
 * invoke(options.callback)
 * invoke(options.callback, ['foo'])
 * ```
 */
export function invoke<T extends () => any | undefined>(
  fn: T,
  args?: Parameters<NonNullable<T>>
): InvokeResult<typeof fn>
export function invoke<T extends AnyFn | undefined>(fn: T, args: Parameters<NonNullable<T>>): InvokeResult<typeof fn>
export function invoke(fn, args?: any[]) {
  if (typeof fn == 'function') {
    return fn.apply(null, args)
  }
}
type InvokeResult<T> = T extends NonNullable<T>
  ? T extends AnyFn
    ? ReturnType<T>
    : T extends AnyFn | undefined
    ? ReturnType<NonNullable<T>> | undefined
    : undefined
  : undefined

export function isEmpty(object: Record<any, any>): object is {} {
  for (let _p in object) {
    return false
  }
  return true
}

export const extend = Object.assign
export const isObject = (o: any): o is Record<any, any> => {
  return typeof o == 'object' && o
}
export const isArray = Array.isArray
export const isFunction = (obj: unknown): obj is Function => typeof obj == 'function'
export const shallowCopy = <T = Record<any, any> | Array<any>>(target: T): T => {
  if (isArray(target)) {
    return target.concat() as any
  }
  if (!isObject(target)) return target

  return extend({}, target)
}
export const trueFn = () => true
export const falseFn = () => false

function type(obj): string {
  return Object.prototype.toString.call(obj).slice(8, -1)
}
/**
 *  深拷贝
 */
export const deepCopy = (data) => {
  const t = type(data)
  let o

  if (t === 'Array') {
    o = []
  } else if (t === 'Object') {
    o = {}
  } else {
    return data
  }

  if (t === 'Array') {
    for (let i = 0; i < data.length; i++) {
      o.push(deepCopy(data[i]))
    }
  } else if (t === 'Object') {
    for (let i in data) {
      o[i] = deepCopy(data[i])
    }
  }
  return o
}

/**
 * 复制部分属性到新的对象
 * @param target 被复制的对象
 * @param keys 需要复制的key数组(根的key)
 * @returns 新的对象
 * @example
 * ``` ts
 * copyProps({a: 1, b: 2}, ['a']) // {a:1}
 * ```
 */
export const pickProps = (target: Record<any, any>, keys: string[]) => {
  let res: any = isArray(target) ? [] : {}
  for (let i in keys) {
    let k = keys[i]
    if (hasOwnProp(target, k)) {
      res[k] = target[k]
    }
  }
  return res
}
type ClassObj = { [x in string]: any }
type ClassArg = undefined | boolean | string | Array<ClassArg | ClassArg[]> | ClassObj
/**
 * 转换为类名
 * @param clsArg 类名对象(对象仅支持一层属性,属性值为布尔值),或者数组,或者string
 * @returns
 */
export const classnames = (...clsArg: ClassArg[]): string => {
  let classArr: string[] = []
  clsArg.forEach((ca) => {
    if (typeof ca == 'string') {
      classArr.push(ca.trim())
    } else if (isArray(ca)) {
      classArr.push(classnames(...ca))
    } else if (isObject(ca)) {
      for (let k in ca) {
        if (ca[k]) {
          classArr.push(k.trim())
        }
      }
    }
  })
  return classArr.filter(Boolean).join(' ')
}
export const trim = (str: string) => {
  return (str || '').trim()
}
