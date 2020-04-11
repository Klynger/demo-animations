import React from 'react'

export type RefType<T> =
  | React.MutableRefObject<T | null>
  | ((instance: T | null) => void)
  | null
  | undefined

export default function setRef<T>(ref: RefType<T>, value: T | null) {
  if (typeof ref === 'function') {
    ref(value)
  } else if (ref) {
    ref.current = value
  }
}