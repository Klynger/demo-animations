import React from 'react';
import { Product } from '../types';
import Button from './Button';

interface Props {
  product: Product
}

export default function ProductSummary(props: Props) {
  const { product: {
    image,
    brand,
    price,
  } } = props;

  return (
     <div className="summary-container">
       <div className="img-container">
         <img className="product-image" src={image} alt="Product" />
       </div>
       <h1 className="product-brand summary-text">{brand}</h1>
      <span className="product-current-price summary-text">{price.currentPrice}</span>
      <Button>
        Buy
      </Button>
     </div>
  )
}
