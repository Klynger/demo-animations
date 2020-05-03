import React, { useRef, useEffect } from 'react'
import classnames from 'classnames'
import { StandardProps } from 'types'
import { CssHandlesInput, CssHandles } from 'css-handles'
import Transition, {
  TransitionStatus,
  EndHandler,
  EnterHandler,
  ExitHandler,
} from 'react-transition-group/Transition'

import '../../collapse.css'
// import styles from '../../collapse.css'
import { duration } from '../../modules/transitionsConstants'
import createTransition from '../../modules/createTransition'
import getAutoHeightDuration from '../../modules/getAutoHeightDuration'
import getTransitionProps, {
  TransitionProps,
} from '../../modules/getTransitionProps'

const HANDLES = [
  'container',
  'entered',
  'hidden',
  'wrapper',
  'wrapperInner',
] as const

type MockCssHandlesType = <T extends CssHandlesInput>(
  handles: T
) => CssHandles<T>

const mockCssModules: MockCssHandlesType = function mockCssHandles(handles) {
  const styles: CssHandles<CssHandlesInput> = {}

  handles.forEach((handle) => {
    styles[handle] = handle
  })

  return styles
}

const styles = mockCssModules(HANDLES)

interface Props extends StandardProps<TransitionProps> {
  in?: boolean
  children: React.ReactNode
  component?: React.ElementType<TransitionProps>
  collapsedHeight?: string | number
}

const Collapse = React.forwardRef(function Collapse(props: Props, ref) {
  const {
    style,
    onExit,
    onEnter,
    children,
    className,
    onEntered,
    onExiting,
    in: inProp,
    onEntering,
    collapsedHeight: collapsedHeightProp = '0px',
    timeout = duration.standard,
    component: Component = 'div',
    ...other
  } = props
  const collapsedHeight =
    typeof collapsedHeightProp === 'number'
      ? `${collapsedHeightProp}px`
      : collapsedHeightProp

  const timer = useRef<number>()
  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const autoTransitionDuration = useRef<number>()

  useEffect(() => {
    return () => {
      clearTimeout(timer.current)
    }
  }, [])

  const handleEnter: EnterHandler = (node, isAppering) => {
    node.style.height = collapsedHeight

    if (onEnter) {
      onEnter(node, isAppering)
    }
  }

  const handleEntering: EnterHandler = (node, isAppering) => {
    const wrappperHeight = wrapperRef.current?.clientHeight ?? 0

    const { duration: transitionDuration } = getTransitionProps(
      { style, timeout: timeout as number },
      {
        mode: 'enter',
      }
    )

    if (timeout === 'auto') {
      const duration2 = getAutoHeightDuration(wrappperHeight)
      node.style.transitionDuration = `${duration2}ms`
      autoTransitionDuration.current = duration2
    } else {
      node.style.transitionDuration =
        typeof transitionDuration === 'string'
          ? transitionDuration
          : `${transitionDuration}ms`
    }

    node.style.height = `${wrappperHeight}px`

    if (onEntering) {
      onEntering(node, isAppering)
    }
  }

  const handleEntered: EnterHandler = (node, isAppering) => {
    node.style.height = 'auto'

    if (onEntered) {
      onEntered(node, isAppering)
    }
  }

  const handleExit: ExitHandler = (node) => {
    const wrapperHeight = wrapperRef.current?.clientHeight ?? 0
    node.style.height = `${wrapperHeight}px`

    if (onExit) {
      onExit(node)
    }
  }

  const handleExiting: ExitHandler = (node) => {
    const wrapperHeight = wrapperRef.current?.clientHeight ?? 0

    const { duration: transitionDuration } = getTransitionProps(
      { style, timeout: timeout as number },
      {
        mode: 'exit',
      }
    )

    if (timeout === 'auto') {
      const duration2 = getAutoHeightDuration(wrapperHeight)
      node.style.transitionDuration = `${duration2}ms`
      autoTransitionDuration.current = duration2
    } else {
      node.style.transitionDuration =
        typeof transitionDuration === 'string'
          ? transitionDuration
          : `${transitionDuration}ms`
    }

    node.style.height = collapsedHeight

    if (onExiting) {
      onExiting(node)
    }
  }

  const addEndListener: EndHandler = (_, next) => {
    if (timeout === 'auto') {
      timer.current = (setTimeout(
        next,
        autoTransitionDuration.current ?? 0
      ) as unknown) as number
    }
  }

  return (
    <Transition
      in={inProp}
      onExit={handleExit}
      onEnter={handleEnter}
      onEntered={handleEntered}
      onExiting={handleExiting}
      onEntering={handleEntering}
      addEndListener={addEndListener}
      timeout={timeout === 'auto' ? undefined : timeout}
      {...(other as any)}
    >
      {(state: TransitionStatus, childProps: any) => {
        const transition = createTransition('height')
        const containerClasses = classnames(className, styles.container, {
          [styles.entered]: state === 'entered',
          [styles.hidden]:
            state === 'exited' && !inProp && collapsedHeight === '0px',
        })

        return (
          <Component
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            className={containerClasses}
            style={{
              minHeight: collapsedHeight,
              transition,
              ...style,
            }}
            ref={ref}
            {...childProps}
          >
            <div className={styles.wrapper} ref={wrapperRef}>
              <div className={styles.wrapperInner}>{children}</div>
            </div>
          </Component>
        )
      }}
    </Transition>
  )
})

export default Collapse
