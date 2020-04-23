import {
  TransitionActions,
  TransitionProps as _TransitionProps,
} from 'react-transition-group/Transition'

export type TransitionHandlerKeys =
  | 'onEnter'
  | 'onEntering'
  | 'onEntered'
  | 'onExit'
  | 'onExiting'
  | 'onExited'
export type TransitionKeys =
  | 'in'
  | 'mountOnEnter'
  | 'unountOnExit'
  | 'timeout'
  | 'mountOnEnter'
  | TransitionHandlerKeys

export interface TransitionProps
  extends TransitionActions,
    Partial<Pick<_TransitionProps, TransitionKeys>> {
  style?: React.CSSProperties
}

export interface TransitionPropsOptions {
  mode: 'enter' | 'exit' | 'appear'
}

export const reflow = (node: HTMLElement) => node.scrollTop

export default function getTransitionProps(
  props: TransitionProps,
  options?: TransitionPropsOptions
) {
  const { style = {}, timeout } = props

  let duration: number | string = 0
  if (typeof timeout === 'number') {
    duration = timeout
  } else if (typeof timeout === 'object' && options && timeout[options.mode]) {
    duration = timeout[options.mode] ?? 0
  }

  return { duration, delay: style.transitionDelay }
}
