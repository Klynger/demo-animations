import React from 'react'
import { Transition } from 'react-transition-group'
import {
  ENTERED,
  ExitHandler,
  EnterHandler,
  TransitionProps,
  TransitionStatus,
  ENTERING,
} from 'react-transition-group/Transition'

import useForkRef from '../../modules/useForkRef'
import { duration } from '../../modules/transitionsConstants'
import getTransitionProps from '../../modules/getTransitionProps'
import createTransition from '../../modules/createTransition'

interface Props {
  in?: boolean
  children: React.ReactElement
  timeout?: TransitionProps['timeout']
  onEnter?: EnterHandler
  onExit?: ExitHandler
}

function getOpacity(state: TransitionStatus) {
  switch (state) {
    case ENTERING:
      return 1
    case ENTERED:
      return 1
    default:
      return 0
  }
}

const defaultTimeout = {
  enter: duration.enteringScreen,
  exit: duration.leavingScreen,
}

const Fade = React.forwardRef(function Fade(
  props: Props,
  ref: React.Ref<unknown>
) {
  const {
    onExit,
    onEnter,
    children,
    in: inProp,
    timeout = defaultTimeout,
    ...other
  } = props

  const handleRef = useForkRef(ref, (children as any).ref)
  const handleEnter: EnterHandler = (node, isAppearing) => {
    const transitionProps = getTransitionProps({ timeout }, { mode: 'enter' })
    node.style.transition = createTransition('opacity', transitionProps)

    if (onEnter) {
      onEnter(node, isAppearing)
    }
  }

  const handleExit: ExitHandler = (node) => {
    const transitionProps = getTransitionProps({ timeout }, { mode: 'exit' })
    node.style.transition = createTransition('opacity', transitionProps)

    if (onExit) {
      onExit(node)
    }
  }

  return (
    <Transition
      appear
      in={inProp}
      timeout={timeout}
      onExit={handleExit}
      onEnter={handleEnter}
      {...other}
    >
      {(state: TransitionStatus) => {
        return React.cloneElement(children, {
          ref: handleRef,
          style: {
            opacity: getOpacity(state),
            visibility: state === 'exited' && !inProp ? 'hidden' : undefined,
            ...children.props.style,
          },
        })
      }}
    </Transition>
  )
})

export default Fade
