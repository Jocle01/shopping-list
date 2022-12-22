import {Component, Input, OnInit} from '@angular/core';
import {ShoppinglistI} from "../../models/shoppinglist";
import {ShoppinglistListComponent} from "../../pages/shoppinglist-list/shoppinglist-list.component";
import {ProductI} from "../../models/product";

@Component({
  selector: 'app-shoppinglist',
  templateUrl: './shoppinglist.component.html',
  styleUrls: ['./shoppinglist.component.less']
})
export class ShoppinglistComponent implements OnInit {

  @Input() shoppinglist?: ShoppinglistI;

  constructor(public shoppinglistListComponent: ShoppinglistListComponent) {}

  ngOnInit(): void {
  }

  //handled das "Chekcen" eines Produktes und gibt an die Page weiter
  toggleProductFinished(product: ProductI | undefined, listId: number | undefined) {
    if(!product || !listId) {return}

    const value = !product.finished;

    this.shoppinglistListComponent.toggleProductFinished(product, listId, value);
  }

}
