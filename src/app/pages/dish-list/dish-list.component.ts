import { Component, OnInit } from '@angular/core';
import {DishI} from "../../models/dish";
import {LitsItemHandlerService} from "../../services/lists-item-handler/lits-item-handler.service";
import {ApiService} from "../../services/api/api.service";
import {AuthenticationService} from "../../services/authentication/authentication.service";
import {ProductI} from "../../models/product";

@Component({
  selector: 'app-dish-list',
  templateUrl: './dish-list.component.html',
  styleUrls: ['./dish-list.component.less']
})
export class DishListComponent implements OnInit {

  //liste mit activeId zur identifizierung des aktuell ausgewählten elements
  managedList: {
    activeItemId: number | undefined;
    list: Array<DishI>;
  };

  //zubearbeitendes Listenelement
  editorDish: DishI | undefined = undefined;

  //flags für editor (editor offen und neuer Eintrag)
  editor: boolean = false;
  newItem: boolean = false;

  constructor(
    public listsItemHandler: LitsItemHandlerService,
    public authenticationService: AuthenticationService,
    private apiService: ApiService
  ) {
    this.managedList = {
      activeItemId: undefined,
      list: [],
    }
  }

  ngOnInit(): void {
    this.getDishes()
  }

  //öffnet editor für NEUEN Eintrag
  newListitem() {
    this.newItem = true;
    this.editor = true
  }

  //öffnet editor mit zubearbeitendem Gericht. Wird in dish aufgerufen.
  editDish(dish: DishI | undefined) {
    if (!dish) {return};
    this.newItem = false;
    this.editorDish = dish;
    this.editor = true;
  }

  //löscht ein Gericht. Wird in dish aufgerufen
  deleteDish(dish: DishI | undefined) {
    this.apiService.postRequest( { "GER_ID": dish?.id, "remove": true}, "/gericht")
      .subscribe(
        response => {
          this.getDishes();
        },
        error => {
          if(error.status == 401) {
            this.authenticationService.logOut();
          }
        }
      )
  }

  //schließt den Bearbeitungsmodus und setzt die Variablen zurück
  closeEditor() {
    this.editor = false;
    this.newItem = false;
    this.editorDish = undefined;
    this.getDishes();
  }

  //entfernt ein Produkt aus Gericht mit der übermittelten ID
  removeProductFromDish(productId: number | undefined, dishId: number | undefined) {

    //typescriptzeugs
    if(productId == undefined || dishId == undefined) {
      return
    }

    this.apiService.postRequest({ "GER_ID": dishId, "PROD_ID": productId, "remove": true }, "/gericht/produkte")
      .subscribe(
        response => {
          this.getDishes();
        },
        error => {
          if(error.status == 401) {
            this.authenticationService.logOut();
          }
        }
      )
  }

  //setzt das angeklickte Element auf Aktiv und holt alle weiteren, notwendigen daten
  onClick(id: number) {

    //bricht ab, wenn das Element bereits aktiv ist
    if (this.managedList.list.find(item => item.id == id)?.isActive) {
      return
    }

    this.managedList = this.listsItemHandler.setActive(id, this.managedList);

    this.apiService.postRequest({ "GER_ID": id }, '/gericht/produkte')
      .subscribe(
        response => {
          const listItem = this.managedList.list.find(item => item.id == id);
          if ( listItem ) {
            console.log(response)
            listItem.recipe = response.Rezept
            listItem.products = response.products.map((el: any) => {
              return {
                amount: el.menge,
                unit: el.einheit,
                product: {
                  id: el.PROD_ID,
                  isActive: undefined,
                  title: el.bezeichnung,
                  isIngredient: undefined,
                  finished: undefined,
                  properties: undefined,
                }
              }
            });
          }
        },
        error => {
          if(error.status == 401) {
            this.authenticationService.logOut();
          }
        }
      )
  }

  //holt alle gerichte
  getDishes() {
    this.apiService.postRequest({}, "/gericht")
      .subscribe(
        response => {

          //speichern der daten in managedlist
          this.managedList.list = response.ger_lst.map((el: any) => {
            return {
              id: el.GER_ID,
              isActive: false,
              title: el.bez,
              time: el.zube_dauer,
              difficulty: el.schwierig,
              recipe: undefined,
              products: undefined,
            }
          })
        },
        error => {

          //der status 401 bedeutet der übermittelte Token ist nicht mehr gültig
          if(error.status == 401) {
            this.authenticationService.logOut();
          }
        }
      )
  }

}
