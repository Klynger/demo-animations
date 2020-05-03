import React from 'react'

import Fade from './animations/Fade'
import Grow from './animations/Grow'
import Zoom from './animations/Zoom'
import Slide from './animations/Slide'
import { PRODUCTS } from '../modules/mock'
import ProductSummary from './ProductSummary'
import Collapse from './animations/Collapse'

const transitionComponents = [Collapse, Zoom, Slide, Fade, Grow] as const

function getAnimationByIndex(i: number) {
  return transitionComponents[i % transitionComponents.length]
}

interface Props {
  show?: boolean
}

export default function Shelf(props: Props) {
  const { show = false } = props
  const products = PRODUCTS

  return (
    <div className="shelf-container">
      <ul className="shelf-list">
        {products.map((product, i) => {
          const TransitionCompponent = getAnimationByIndex(i)
          return (
            <TransitionCompponent in={show} key={product.brand}>
              <li>
                <ProductSummary product={product} />
              </li>
            </TransitionCompponent>
          )
        })}
      </ul>
    </div>
  );
}
