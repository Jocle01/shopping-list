import {PropertyI} from "./property";

export interface ProductI {
  id: number,
  isActive: boolean | undefined,
  title: string,
  isIngredient: boolean | undefined,
  finished: boolean | undefined,
  properties: Array<PropertyI | undefined>;
}
