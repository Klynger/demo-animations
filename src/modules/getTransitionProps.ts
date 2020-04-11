import {
  TransitionActions,
  TransitionProps as _TransitionProps,
} from 'react-transition-group/Transition'

export type TransitionHandlerKeys = 'onEnter' | 'onExit'
export type TransitionKeys = 'in' | 'timeout' | TransitionHandlerKeys
export type TransitionProps = TransitionActions &
  Partial<Pick<_TransitionProps, TransitionKeys>>

export interface TransitionPropsOptions {
  mode: 'enter' | 'exit' | 'appear'
}

export default function getTransitionProps(
  props: TransitionProps,
  options?: TransitionPropsOptions
) {
  const { timeout } = props

  let duration: number | string | undefined = 0
  if (typeof timeout === 'number') {
    duration = timeout
  } else if (typeof timeout === 'object' && options && timeout[options.mode]) {
    duration = timeout[options.mode]
  }

  return { duration }
}
