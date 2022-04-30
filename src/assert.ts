import { isObject } from './common'

export function isAsyncFn(fn: unknown): fn is (...[args]: any[]) => Promise<any> {
  return typeof fn == 'function' && fn[Symbol.toStringTag] == 'AsyncFunction'
}

export function thenAble(obj: unknown): obj is Promise<any> {
  return isObject(obj) && typeof obj.then == 'function'
}

export function isGenerator(
  val: AsyncGenerator<void, void, void> | Promise<void>
): val is AsyncGenerator<void, void, void> {
  return typeof val[Symbol.asyncIterator] === 'function'
}
