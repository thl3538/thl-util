export type AnyFn = (...a: any[]) => any
/**
 * 把类型T的Key为K的属性设置为必须
 */
export type RequiredProps<T, K extends keyof T> = {
  [p in K]-?: T[p]
} & T

/**
 * 属性类型
 */
export type PropsType<T> = T extends Record<any, infer V> ? V : never
