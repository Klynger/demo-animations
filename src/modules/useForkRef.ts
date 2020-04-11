import { useMemo } from 'react'

import setRef, { RefType } from './setRef'

export default function useForkRef<T>(
  refA: RefType<T>,
  refB: RefType<T>
): React.Ref<T> {
  return useMemo(() => {
    if (refA == null && refB == null) {
      return null
    }
    return (refValue) => {
      setRef(refA, refValue)
      setRef(refB, refValue)
    }
  }, [refA, refB])
}