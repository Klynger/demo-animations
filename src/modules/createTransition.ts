import {
  easing as easingFunctions,
  duration as transitionDuration,
} from './transitionsConstants'

export interface TransitionCreationOptions {
  duration: number | string
  easing: string
  delay: number | string
}

const formatMs = (milliseconds: number) => `${Math.round(milliseconds)}ms`

export default function createTransition(
  props: string | string[] = ['all'],
  options: Partial<TransitionCreationOptions> = {}
) {
  const {
    delay = 0,
    easing = easingFunctions.easeInOut,
    duration = transitionDuration.standard,
  } = options

  return (Array.isArray(props) ? props : [props])
    .map(
      (animatedProp) =>
        `${animatedProp} ${
          typeof duration === 'string' ? duration : formatMs(duration)
        } ${easing} ${typeof delay === 'string' ? delay : formatMs(delay)}`
    )
    .join(',')
}
