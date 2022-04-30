import { isObject } from './common'

export const parseJSON = (s: unknown) => {
  if (typeof s == 'string') {
    return JSON.parse(s)
  }
  return s
}

export const stringfyJSON = (o: unknown) => {
  if (isObject(o)) {
    return JSON.stringify(o)
  }
  return o
}
