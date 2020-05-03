declare module 'types' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export type Omit<T, K extends keyof any> = T extends any
    ? Pick<T, Exclude<keyof T, K>>
    : never

  export type StandardProps<C, Removals extends keyof C = never> = Omit<
    C,
    Removals
  > & {
    className?: string
    ref?: C extends { ref?: infer RefType } ? RefType : React.Ref<unknown>
  }
}
