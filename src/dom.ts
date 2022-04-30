import { isArray, trim } from './common'

export function hasClass(el: Element, cls: string) {
  if (!el || !cls) return false
  if (cls.indexOf(' ') !== -1) throw new Error('className should not contain space.')
  if (el.classList) {
    return el.classList.contains(cls)
  } else {
    return (' ' + el.className + ' ').indexOf(' ' + cls + ' ') > -1
  }
}
export function addClass(el: Element, cls: string) {
  if (!el) return
  let curClass = el.className
  const classes = (cls || '').split(' ')

  for (let i = 0, j = classes.length; i < j; i++) {
    const clsName = classes[i]
    if (!clsName) continue

    if (el.classList) {
      el.classList.add(clsName)
    } else {
      if (!hasClass(el, clsName)) {
        curClass += ' ' + clsName
      }
    }
  }
  if (!el.classList) {
    el.className = curClass
  }
}

export function removeClass(el: Element, cls: string) {
  if (!el || !cls) return
  var classes = cls.split(' ')
  var curClass = ' ' + el.className + ' '

  for (var i = 0, j = classes.length; i < j; i++) {
    var clsName = classes[i]
    if (!clsName) continue

    if (el.classList) {
      el.classList.remove(clsName)
    } else if (hasClass(el, clsName)) {
      curClass = curClass.replace(' ' + clsName + ' ', ' ')
    }
  }
  if (!el.classList) {
    el.className = trim(curClass)
  }
}
// todo improve
export function toggleClass(el: Element, className: string) {
  if (!el || !className) return
  const clsArr = className.split(' ')

  clsArr.forEach((cls) => {
    if (hasClass(el, cls)) {
      removeClass(el, cls)
    } else {
      addClass(el, cls)
    }
  })
}

export function createElement(tag: keyof HTMLElementTagNameMap, container?: Element, classname?: string) {
  let el = document.createElement(tag)
  if (container) {
    container.appendChild(el)
  }
  if (classname) {
    el.className = classname
  }
  return el
}
export function removeElement(el: Element | string) {
  if (typeof el == 'string') {
    el = document.querySelector(el)
  }
  let parent = el.parentElement
  parent && parent.removeChild(el)
}

const loadedScripts: { [src: string]: boolean | Array<() => any> } = {}

interface LoadScriptOptions extends Partial<HTMLScriptElement> {}

export const loadScript = (src: string, options: LoadScriptOptions = {}): Promise<void> => {
  return new Promise((resolve, reject) => {
    let complete = document.readyState == 'complete'
    loadedScripts[src] = false

    const load = () => {
      let el = createElement('script') as HTMLScriptElement
      el.src = src

      Object.assign(el, options)

      el.addEventListener('error', (e) => {
        console.error('loadScript error', src, e)
      })

      el.onload = () => {
        let fns = loadedScripts[src]

        if (isArray(fns)) {
          fns.forEach((f) => f())
        }

        loadedScripts[src] = true
        resolve()
      }
      el.onerror = reject
      document.body.append(el)
    }
    if (complete) {
      load()
    } else {
      window.addEventListener('load', load)
    }
  })
}

/**
 * 保证同一src只加载一次
 */
export const loadScriptOnce = (src: string, options: LoadScriptOptions = {}): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!(src in loadedScripts)) {
      return loadScript(src, options).then(resolve, reject)
    }

    if (loadedScripts[src] === true) return resolve()

    if (loadedScripts[src] === false) {
      return (loadedScripts[src] = [resolve])
    }

    return isArray(loadedScripts[src]) && (loadedScripts[src] as any).push(resolve)
  })
}
