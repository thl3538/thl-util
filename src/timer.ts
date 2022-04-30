export const sleep = (time) => {
  return new Promise((r) => {
    setTimeout(() => {
      r(time)
    }, time)
  })
}
