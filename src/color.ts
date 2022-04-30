import { isObject } from './common'

export function hexToRGB(hex: string): RGB | undefined {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      }
    : undefined
}

export type Color = RGBA | RGB | string

export function rgb(color: Color | undefined) {
  let colorObj: any

  if (typeof color == 'string') {
    if (isRgba(color)) {
      return rgbaToRgb(color)
    } else if (isRgb(color)) {
      return color
    }

    colorObj = hexToRGB(color)
  } else {
    colorObj = color
  }

  if (!colorObj) return
  return `rgb(${colorObj.r},${colorObj.g},${colorObj.b})`
}

function _isRGBA(color: Color): color is RGBA {
  return isObject(color) && 'a' in color
}
/**
 * @param color 颜色字符串或RBG,RGBA颜色对象, rgb/rgba/hex
 * @returns rgba color string
 * @example
 * rgba('#ffffff', 0.2) // 'rgba(255,255,255,0.2)'
 */
export function rgba(color: Color | undefined, a: number) {
  let colorObj: any

  if (typeof color == 'string') {
    if (isRgba(color)) {
      return a === undefined ? color : rgbaUpdate(color, a)
    } else if (isRgb(color)) {
      return rgbToRgba(color, a || 0)
    }

    colorObj = hexToRGB(color)
  } else {
    colorObj = color
  }

  if (!colorObj) return
  return `rgba(${colorObj.r},${colorObj.g},${colorObj.b},${_isRGBA(color) ? color.a : a || 0})`
}

export function isRgba(str: string) {
  return /rgba\(.+\)/.test(str)
}

export function isRgb(str: string) {
  return /rgb\(.+\)/.test(str)
}

export function isHexColor(str) {
  return /^#[\da-zA-Z]+$/.test(str)
}
export function rgbToRgba(str: string, a: number) {
  return str.replace(')', `,${a})`).replace('rgb', 'rgba')
}
export function rgbaToRgb(rgba) {
  return rgba.replace(/,\d+\.?\d*\)/g, ')').replace('rgba', 'rgb')
}
export function rgbaUpdate(rgba: string, a: number) {
  return rgba.replace(/,\d+\.?\d*\)/g, `,${a})`)
}

export interface RGB {
  r: number
  g: number
  b: number
}

export interface RGBA extends RGB {
  a: number
}
