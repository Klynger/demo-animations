declare module 'css-handles' {
  type CssHandlesInput = readonly string[]
  type ValueOf<T extends readonly unknown[]> = T[number]
  type CssHandles<T extends CssHandlesInput> = Record<ValueOf<T>, string>
}
