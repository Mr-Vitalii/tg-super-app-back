export type Product = {
  id: string;
  title: string;
  price: number;
  description: string;
  img: string;
}

export type WebDataRequest = {
  queryId: string;
  products: Product[];
  totalPrice: number;
}