import React from 'react'
import Transition, {
  TransitionStatus,
  ENTERING,
  ENTERED,
  EnterHandler,
  ExitHandler,
} from 'react-transition-group/Transition'

import getTransitionProps, {
  TransitionProps,
  reflow,
} from '../../modules/getTransitionProps'
import { duration } from '../../modules/transitionsConstants'
import useForkRef from '../../modules/useForkRef'
import createTransition from '../../modules/createTransition'

interface Props extends TransitionProps {
  in?: boolean
  children: React.ReactElement
}

type PossibleStyles = typeof ENTERING | typeof ENTERED

const styles: Record<PossibleStyles | string, React.CSSProperties> = {
  entering: {
    transform: 'none',
  },
  entered: {
    transform: 'none',
  },
}

const defaultTimeout = {
  enter: duration.enteringScreen,
  exit: duration.leavingScreen,
}

const Zoom = React.forwardRef(function Zoom(
  props: Props,
  ref: React.Ref<HTMLElement>
) {
  const {
    style,
    onExit,
    onEnter,
    children,
    in: inProp,
    timeout = defaultTimeout,
  } = props
  const handleRef = useForkRef((children as any).ref, ref)

  const handleEnter: EnterHandler = (node, isApearing) => {
    reflow(node) // So the animation always start from the start.

    const transitionProps = getTransitionProps(
      { style, timeout },
      {
        mode: 'enter',
      }
    )

    node.style.webkitTransition = createTransition('transform', transitionProps)
    node.style.transition = createTransition('transform', transitionProps)

    if (onEnter) {
      onEnter(node, isApearing)
    }
  }

  const handleExit: ExitHandler = (node) => {
    const transitionProps = getTransitionProps(
      { style, timeout },
      {
        mode: 'exit',
      }
    )

    node.style.webkitTransition = createTransition('transform', transitionProps)
    node.style.transition = createTransition('transform', transitionProps)

    if (onExit) {
      onExit(node)
    }
  }

  return (
    <Transition
      in={inProp}
      timeout={timeout}
      onExit={handleExit}
      onEnter={handleEnter}
    >
      {(state: TransitionStatus, childProps: any) => {
        return React.cloneElement(children, {
          style: {
            transform: 'scale(0)',
            visibility: state === 'exited' && !inProp ? 'hidden' : undefined,
            ...styles[state],
            ...style,
            ...children.props.style,
          },
          ...childProps,
          ref: handleRef,
        })
      }}
    </Transition>
  )
})

export default Zoom
