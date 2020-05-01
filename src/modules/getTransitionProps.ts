import { CSSProperties } from 'react'
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
  | 'unmountOnExit'
  | 'timeout'
  | 'addEndListener'
  | TransitionHandlerKeys

export interface TransitionProps
  extends TransitionActions,
    Partial<Pick<_TransitionProps, TransitionKeys>> {
  style?: CSSProperties
}

export interface TransitionPropsOptions {
  mode: 'enter' | 'exit' | 'appear'
}

export const reflow = (node: HTMLElement) => node.scrollTop

export default function getTransitionProps(
  props: TransitionProps,
  options: TransitionPropsOptions
) {
  const { style = {}, timeout } = props
  const { mode } = options

  return {
    duration: typeof timeout === 'number' ? timeout : timeout?.[mode] ?? 0,
    delay: style.transitionDelay,
  }
}
