export interface Price {
  currentPrice: string
  prevPrice: string
  installments: string
  hasInterest: boolean
}

export interface Product {
  brand: string
  price: Price
  image: string
}