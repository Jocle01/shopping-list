import {ProductI} from "./product";

export interface DishI {
  id: number,
  isActive: boolean,
  title: string,
  time: string | undefined,
  difficulty: number | undefined,
  recipe: string | undefined,
  products: Array<
    {
      amount: number,
      unit: string,
      product: ProductI,
    }
    > | undefined,
}
