import React, { useEffect, useState } from 'react'

import Fade from './animations/Fade'
import Grow from './animations/Grow'
import { PRODUCTS } from '../modules/mock'
import ProductSummary from './ProductSummary'

function getAnimationByIndex(i: number) {
  return i % 2 === 0 ? Fade : Grow
}

export default function Shelf() {
  const products = PRODUCTS
  console.log(products)
  const [show, setShow] = useState(false)

  useEffect(() => {
    setShow(true)
  }, [])

  return (
    <div className="shelf-container">
      <ul className="shelf-list">
        {products.map((product, i) => {
          console.log('iae boy ', i)
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
