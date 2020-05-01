export interface Cancelable {
  clear(): void
}

// Corresponds to 10 frames at 60 Hz.
// A few bytes payload overhead when lodash/debounce is ~3 kB and debounce ~300 B.
export default function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait = 166
): T & Cancelable {
  let timeout: number
  function debounced(...args: any[]) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore 'this' has implicit type any and there is no way to type this here
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this
    const later = () => {
      func.apply(self, args)
    }
    clearTimeout(timeout)
    timeout = (setTimeout(later, wait) as unknown) as number
  }

  debounced.clear = () => {
    clearTimeout(timeout)
  }

  return debounced as T & Cancelable
}
