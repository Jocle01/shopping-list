import {ProductI} from "./product";

export interface ShoppinglistI {
  id: number,
  isActive: boolean,
  title: string,
  note: string | undefined,
  timestamp: string,
  finished: boolean,
  products: Array<
    {
      amount: number,
      unit: string,
      product: ProductI,
    }
  > | undefined,
}
