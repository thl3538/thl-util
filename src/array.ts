export const excludeElement = (a: any[], b: any[]) => {
  var extarted = []
  for (let i = 0; i < a.length; i++) {
    const el = a[i]
    if (b.includes(el)) continue
    extarted.push(el)
  }
  return extarted
}

export function uniqueElement(a: any[]) {
  return [...new Set(a)]
}

export function sortBy(list: any[], from: any[], fn, slice = true) {
  const backup = list.map((value) => ({ value, index: -1 }))

  from.forEach((b, fi) => {
    const target = backup.find((a) => fn(a.value, b))
    if (target) {
      target.index = fi
    }
  })

  backup
    .sort((a, b) => a.index - b.index)
    .forEach((item, index) => {
      list[index] = item.value
    })

  if (slice && backup.length - from.length > 0) {
    list.splice(0, backup.length - from.length)
  }
  return list
}
