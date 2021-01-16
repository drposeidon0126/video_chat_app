export function afterView(fn: () => void) {
  setTimeout(() => fn.apply(arguments))
}
export function after(fn: () => void, timer = 1000) {
  setTimeout(() => fn.apply(arguments), timer)
}
