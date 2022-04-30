import { AnyFn } from './ts-type'

/**
 * 返回一个函数,每次调用时会重新计时直到时间到达后运行
 * @param fn 需要调用的函数
 * @param time 需要延时的时间 ms
 * @returns
 */
export const whileDelayRun = (fn: () => any, time: number) => {
  var t
  const cancel = () => {
    if (t) {
      clearTimeout(t)
    }
    var cleared = t !== undefined
    t = undefined
    return cleared
  }
  const run = () => {
    cancel()
    t = setTimeout(() => {
      fn()
    }, time)
  }
  run.cancel = cancel
  return run
}
export const voteRunOnce = (condition: () => boolean, fn: AnyFn, time: number, immediate = false) => {
  let runed = false
  let t
  const run = () => {
    if (condition()) {
      runed = true
      t = undefined
      fn()
    } else if (!runed) {
      setTimeout(() => {
        run()
      }, time)
    }
  }
  if (immediate) {
    run()
  } else {
    t = setTimeout(run, time)
  }
  const cancel = () => {
    var cleared = t !== undefined
    clearTimeout(t)
    t = undefined
    return cleared
  }
  return cancel
}
type LimitDuplicationRunner = {
  (...arg: any): any
  __time?: number
}
/**
 * 在距离上次调用一段时间内不再重复调用
 * @param fn
 * @param time 间隔可调用的时间
 */
export const limitDuplication = (fn: AnyFn, time: number) => {
  const runner: LimitDuplicationRunner = (...arg: any[]) => {
    if (!runner.__time || Date.now() - runner.__time >= time) {
      runner.__time = Date.now()
      return fn && fn(...arg)
    }
  }
  return runner
}

/**
 * 延时运行,在指定时间内多次调用只调用最后一次(参数也取最后一次的)
 * @param fn
 * @param time
 * @returns
 */
export const delayRunLast = (fn: AnyFn, time: number) => {
  var _args: any[] = []
  var t
  const runner = (...args) => {
    _args = args
    if (!t) {
      t = setTimeout(() => {
        t = undefined
        fn && fn(..._args)
      }, time)
    }
  }
  return runner
}
export const runOnce = (fn: AnyFn) => {
  var res
  const runner = (...args) => {
    if (!runner.runed) {
      runner.runed = true
      res = fn(...args)
    }
    return res
  }
  runner.runed = false
  return runner
}
