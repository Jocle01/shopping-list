import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {DishListComponent} from "./pages/dish-list/dish-list.component";
import {ProductListComponent} from "./pages/product-list/product-list.component";
import {ShoppinglistListComponent} from "./pages/shoppinglist-list/shoppinglist-list.component";

const routes: Routes = [
  { path: '', component: ShoppinglistListComponent },
  { path: 'einkaufslisten', component: ShoppinglistListComponent },
  { path: 'gerichte', component: DishListComponent },
  { path: 'produkte', component: ProductListComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
