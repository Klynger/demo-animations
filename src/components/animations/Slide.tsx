import React, { useCallback, useEffect } from 'react'
import Transition, {
  EnterHandler,
  TransitionStatus,
  ExitHandler,
} from 'react-transition-group/Transition'

import debounce from '../../modules/debounce'
import useForkRef from '../../modules/useForkRef'
import createTransition from '../../modules/createTransition'
import { duration, easing } from '../../modules/transitionsConstants'
import getTransitionProps, {
  TransitionProps,
  reflow,
} from '../../modules/getTransitionProps'

type Direction = 'left' | 'right' | 'up' | 'down'

interface Props extends TransitionProps {
  children: React.ReactElement<any, any>
  direction?: Direction
  in?: TransitionProps['in']
  ref?: React.Ref<unknown>
  timeout?: TransitionProps['timeout']
}

// Translate the node so he can't be seen on the screen.
// Later, we gonna translate back the node to his original location
// with `none`.`
function getTranslateValue(direction: Direction, node: Element) {
  const rect = node.getBoundingClientRect()
  let transform

  if ((node as any).fakeTransform) {
    transform = (node as any).fakeTransform
  } else {
    const computedStyle = window.getComputedStyle(node)
    transform =
      computedStyle.getPropertyValue('-webkit-transform') ||
      computedStyle.getPropertyValue('transform')
  }

  let offsetX = 0
  let offsetY = 0

  if (transform && transform !== 'none' && typeof transform === 'string') {
    const transformValues = transform.split('(')[1].split(')')[0].split(',')
    offsetX = parseInt(transformValues[4], 10)
    offsetY = parseInt(transformValues[5], 10)
  }

  if (direction === 'left') {
    return `translateX(${window.innerWidth}px) translateX(-${
      rect.left - offsetX
    }px)`
  }

  if (direction === 'right') {
    return `translateX(-${rect.left + rect.width - offsetX}px)`
  }

  if (direction === 'up') {
    return `translateY(${window.innerHeight}px) translateY(-${
      rect.top - offsetY
    }px)`
  }

  // direction === 'down'
  return `translateY(-${rect.top + rect.height - offsetY}px)`
}

export function setTranslateValue(direction: Direction, node: HTMLElement) {
  const transform = getTranslateValue(direction, node)

  if (!transform) {
    return
  }

  node.style.webkitTransform = transform
  node.style.transform = transform
}

const defaultTimeout = {
  enter: duration.enteringScreen,
  exit: duration.leavingScreen,
}

const Slide = React.forwardRef(function Slide(
  props: Props,
  ref: React.Ref<HTMLElement>
) {
  const {
    style,
    onExit,
    onEnter,
    children,
    onExited,
    onEntering,
    in: inProp,
    direction = 'down',
    timeout = defaultTimeout,
    ...other
  } = props

  const childrenRef: React.MutableRefObject<HTMLElement | null> = React.useRef(
    null
  )

  const handleRefIntermediary = useForkRef((children as any)?.ref, childrenRef)
  const handleRef = useForkRef(handleRefIntermediary, ref)

  const handleEnter: EnterHandler = (_, isAppearing) => {
    const node = childrenRef.current
    if (!node) {
      return
    }

    setTranslateValue(direction, node)
    reflow(node)

    if (onEnter) {
      onEnter(node, isAppearing)
    }
  }

  const handleEntering: EnterHandler = (node, isAppearing) => {
    const transitionProps = getTransitionProps(
      { timeout, style },
      {
        mode: 'enter',
      }
    )

    node.style.webkitTransition = createTransition('-webkit-transform', {
      ...transitionProps,
      easing: easing.easeOut,
    })

    node.style.transition = createTransition('transform', {
      ...transitionProps,
      easing: easing.easeOut,
    })

    node.style.webkitTransform = 'none'
    node.style.transform = 'none'
    if (onEntering) {
      onEntering(node, isAppearing)
    }
  }

  const handleExit: ExitHandler = (node) => {
    const transitionProps = getTransitionProps(
      { timeout, style },
      {
        mode: 'exit',
      }
    )

    node.style.webkitTransition = createTransition('-webkit-transform', {
      ...transitionProps,
      easing: easing.sharp,
    })

    node.style.transition = createTransition('transform', {
      ...transitionProps,
      easing: easing.sharp,
    })

    setTranslateValue(direction, node)

    if (onExit) {
      onExit(node)
    }
  }

  const handleExited: ExitHandler = (node) => {
    node.style.webkitTransition = ''
    node.style.transition = ''

    if (onExited) {
      onExited(node)
    }
  }

  const updatePosition = useCallback(() => {
    if (childrenRef.current) {
      setTranslateValue(direction, childrenRef.current)
    }
  }, [direction])

  useEffect(() => {
    if (inProp || direction === 'down' || direction === 'right') {
      return undefined
    }

    const handleResize = debounce(() => {
      if (childrenRef.current) {
        setTranslateValue(direction, childrenRef.current)
      }
    })

    window.addEventListener('resize', handleResize)
    return () => {
      handleResize.clear()
      window.removeEventListener('resize', handleResize)
    }
  }, [direction, inProp])

  useEffect(() => {
    if (!inProp) {
      // We need to update the position of the drawer when the direction change and
      // when it's hidden.
      updatePosition()
    }
  }, [inProp, updatePosition])

  return (
    <Transition
      appear
      in={inProp}
      timeout={timeout}
      onExit={handleExit}
      onEnter={handleEnter}
      onExited={handleExited}
      onEntering={handleEntering}
      {...(other as any)}
    >
      {(state: TransitionStatus, childProps: any) => {
        return React.cloneElement(children, {
          ref: handleRef,
          style: {
            visibility: state === 'exited' && !inProp ? 'hidden' : undefined,
            ...style,
            ...children.props.style,
          },
          ...childProps,
        })
      }}
    </Transition>
  )
})

export default Slide
