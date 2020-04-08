import React from 'react';
import { PRODUCTS } from '.././modules/mock';
import ProductSummary from './ProductSummary';

export default function Shelf() {
  const products = PRODUCTS;
  return (
    <div className="shelf-container">
      <ul className="shelf-list">
        {products.map(product => (
          <li key={product.brand}>
            <ProductSummary product={product} />
          </li>
        ))}
      </ul>
    </div>
  );
}
