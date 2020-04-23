import React, { useRef, useEffect, CSSProperties } from 'react'
import Transition, {
  EndHandler,
  ExitHandler,
  EnterHandler,
  TransitionProps,
  TransitionStatus,
  ENTERING,
  ENTERED,
} from 'react-transition-group/Transition'

import useForkRef from '../../modules/useForkRef'
import getTransitionProps, { reflow } from '../../modules/getTransitionProps'
import getAutoHeightDuration from '../../modules/getAutoHeightDuration'
import createTransition from '../../modules/createTransition'

interface Props<T extends HTMLElement>
  extends React.DetailedHTMLProps<React.HTMLAttributes<T>, T> {
  in?: boolean
  onExit?: ExitHandler
  onEnter?: EnterHandler
  children: React.ReactElement
  timeout?: TransitionProps['timeout'] | 'auto'
}

function getScale(value: number) {
  return `scale(${value}, ${value ** 2})`
}

type PossibleStyles = typeof ENTERING | typeof ENTERED

const styles: Record<PossibleStyles | string, CSSProperties> = {
  entering: {
    opacity: 1,
    transform: getScale(1),
  },
  entered: {
    opacity: 1,
    transform: 'none',
  },
}

const Grow = React.forwardRef(function Grou(
  props: Props<any>,
  ref: React.Ref<HTMLElement>
) {
  const {
    style,
    onExit,
    onEnter,
    children,
    in: inProp,
    timeout = 'auto',
    ...other
  } = props
  const handleRef = useForkRef((children as any).ref, ref)
  const timer = useRef<number | undefined>()
  const autoTimeout = useRef<number | undefined>()
  const handleEnter: EnterHandler = (node, isAppearing) => {
    reflow(node) // So the animation always start from the start

    // The cast is because timeout cannot be 'auto', but if this happens
    // it will just return duration as 0, so it's ok to cast this here
    const { duration: transitionDuration, delay } = getTransitionProps(
      { style, timeout: timeout as number },
      {
        mode: 'enter',
      }
    )

    let duration = transitionDuration
    if (timeout === 'auto') {
      duration = getAutoHeightDuration(node.clientHeight)
    }

    node.style.transition = [
      createTransition('opacity', {
        duration,
        delay,
      }),
      createTransition('transform', {
        duration: duration * 0.666,
        delay,
      }),
    ].join(',')

    if (onEnter) {
      onEnter(node, isAppearing)
    }
  }

  const handleExit: ExitHandler = (node) => {
    const { duration: transitionDuration, delay } = getTransitionProps(
      { style, timeout: timeout as number },
      { mode: 'exit' }
    )

    let duration = transitionDuration
    if (timeout === 'auto') {
      duration = getAutoHeightDuration(node.clientHeight)
      autoTimeout.current = duration
    }

    node.style.transition = [
      createTransition('opacity', {
        delay,
        duration,
      }),
      createTransition('transform', {
        duration: duration * 0.666,
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        delay: delay || duration * 0.333,
      }),
    ].join(',')

    node.style.opacity = '0'
    node.style.transform = getScale(0.75)

    if (onExit) {
      onExit(node)
    }
  }

  const addEndListener: EndHandler = (_, next) => {
    if (timeout === 'auto') {
      timer.current = (setTimeout(
        next,
        autoTimeout.current ?? 0
      ) as unknown) as number
    }
  }

  useEffect(() => {
    return () => {
      clearTimeout(timer.current)
    }
  }, [])

  return (
    <Transition
      appear
      in={inProp}
      onExit={handleExit}
      onEnter={handleEnter}
      addEndListener={addEndListener}
      timeout={timeout === 'auto' ? 0 : timeout}
      {...other}
    >
      {(state: TransitionStatus, childProps: any) => {
        return React.cloneElement(children, {
          style: {
            opacity: 0,
            transform: getScale(0.75),
            visibility: state === 'exited' && !inProp ? 'hidden' : undefined,
            ...style,
            ...styles[state],
            ...children.props.style,
          },
          ref: handleRef,
          ...childProps,
        })
      }}
    </Transition>
  )
})

export default Grow
