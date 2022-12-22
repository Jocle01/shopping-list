import {Component, Input, OnInit} from '@angular/core';
import {ProductI} from "../../models/product";
import {ProductListComponent} from "../../pages/product-list/product-list.component";

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.less']
})
export class ProductComponent implements OnInit {

  @Input() product?: ProductI;

  constructor(public productListComponent: ProductListComponent) { }

  ngOnInit(): void {
  }

}
