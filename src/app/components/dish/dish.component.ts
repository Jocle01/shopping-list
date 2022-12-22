import {Component, Input, OnInit} from '@angular/core';
import {DishI} from "../../models/dish";
import {DishListComponent} from "../../pages/dish-list/dish-list.component";

@Component({
  selector: 'app-dish',
  templateUrl: './dish.component.html',
  styleUrls: ['./dish.component.less']
})
export class DishComponent implements OnInit {

  @Input() dish?: DishI;

  constructor(public dishListComponent: DishListComponent) { }

  ngOnInit(): void {
  }
}
