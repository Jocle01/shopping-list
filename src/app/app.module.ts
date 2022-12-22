import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import {HttpClientModule} from "@angular/common/http";
import {ReactiveFormsModule} from "@angular/forms";

import { AppComponent } from './app.component';

import { LoginComponent } from './pages/login/login.component';
import { DishListComponent } from './pages/dish-list/dish-list.component';
import { ProductListComponent } from './pages/product-list/product-list.component';
import { ShoppinglistListComponent } from './pages/shoppinglist-list/shoppinglist-list.component';

import { HeaderComponent } from './components/header/header.component';
import { ShoppinglistComponent } from './components/shoppinglist/shoppinglist.component';
import { ProductComponent } from './components/product/product.component';
import { DishComponent } from './components/dish/dish.component';
import { ShoppinglistEditorComponent } from './components/shoppinglist-editor/shoppinglist-editor.component';
import { ProductEditorComponent } from './components/product-editor/product-editor.component';
import { DishEditorComponent } from './components/dish-editor/dish-editor.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    DishListComponent,
    ProductListComponent,
    ShoppinglistListComponent,
    ShoppinglistComponent,
    ProductComponent,
    DishComponent,
    LoginComponent,
    ShoppinglistEditorComponent,
    ProductEditorComponent,
    DishEditorComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
