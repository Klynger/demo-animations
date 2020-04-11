import React, { useEffect, useState } from 'react'

import Fade from './animations/Fade'
import { PRODUCTS } from '../modules/mock'
import ProductSummary from './ProductSummary'

export default function Shelf() {
  const products = PRODUCTS
  const [show, setShow] = useState(false)

  useEffect(() => {
    setShow(true)
  }, [])
  return (
    <div className="shelf-container">
      <ul className="shelf-list">
        {products.map((product) => (
          <Fade in={show} key={product.brand}>
            <li>
              <ProductSummary product={product} />
            </li>
          </Fade>
        ))}
      </ul>
    </div>
  );
}
