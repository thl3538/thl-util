import { isGenerator, thenAble } from './assert'
import { isArray, isFunction } from './common'

export async function AsyncCall(fn: (...args: any[]) => any, args?: any[]): Promise<any> {
  const callRes = fn.apply(null, args)
  if (isGenerator(callRes)) {
    while (true) {
      const result = await callRes.next()
      if (result.done) {
        return result.value
      }
    }
  } else if (thenAble(callRes)) {
    return await callRes
  } else {
    return callRes
  }
}

export function callFn(fn: (...args: any[]) => any, args?: any[]): any
export function callFn(fn: (...args: any[]) => any, thisArg?: any, args?: any[]): any
export function callFn(fn: (...args: any[]) => any, thisArg?: any, args?: any): any {
  if (isFunction(fn)) {
    if (isArray(thisArg)) {
      args = thisArg
      thisArg = null
    }

    return fn.apply(thisArg, args)
  }
}
