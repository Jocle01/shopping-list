import { Component, OnInit } from '@angular/core';
import {ApiService} from "../../services/api/api.service";
import {AuthenticationService} from "../../services/authentication/authentication.service";
import {ShoppinglistI} from "../../models/shoppinglist";
import {LitsItemHandlerService} from "../../services/lists-item-handler/lits-item-handler.service";
import {ProductI} from "../../models/product";

@Component({
  selector: 'app-shoppinglist-list',
  templateUrl: './shoppinglist-list.component.html',
  styleUrls: ['./shoppinglist-list.component.less']
})
export class ShoppinglistListComponent implements OnInit {

  //liste mit activeId zur identifizierung des aktuell ausgewählten elements
  managedList: {
    activeItemId: number | undefined;
    list: Array<ShoppinglistI>;
  };

  //zubearbeitendes Listenelement
  editorShoppinglist: ShoppinglistI | undefined = undefined;

  //flags für editor (editor offen und neuer Eintrag)
  editor: boolean = false;
  newItem: boolean = false;

  constructor(
    private apiService: ApiService,
    public authenticationService: AuthenticationService,
    public listsItemHandler: LitsItemHandlerService,
  ) {
    this.managedList = {
      activeItemId: undefined,
      list: [],
    }
  }

  ngOnInit(): void {
    this.getShoppinglists()
  }

  //öffnet editor für NEUEN Eintrag
  newListitem() {
    this.newItem = true;
    this.editor = true
  }

  //öffnet editor mit zubearbeitender Einkaufsliste. Wird in shoppinglist aufgerufen.
  editShoppinglist(shoppinglist: ShoppinglistI | undefined) {

    //type überprüfung (nötig wegen typescript)
    if (!shoppinglist) {return};

    this.newItem = false;
    this.editorShoppinglist = shoppinglist;
    this.editor = true;
  }

  //markiert eine Liste als erledigt bzw. nicht erledigt. Wird in shoppinglist aufgerufen
  toggleListDone(shoppinglist: ShoppinglistI | undefined) {

    this.apiService.postRequest( { "EKL_ID": shoppinglist?.id, "finish": !shoppinglist?.finished}, "/benutzer/einkaufsliste")
      .subscribe(
        response => {

          //lädt Listenelemente neu
          this.getShoppinglists();
        }
      )
  }

  //schließt den Bearbeitungsmodus und setzt die Variablen zurück
  closeEditor() {
    this.editor = false;
    this.newItem = false;
    this.editorShoppinglist = undefined;
    this.getShoppinglists();
  }

  //entfernt ein Produkt von der Einkaufsliste mit der übermittelten ID
  removeProductFromShoppinglist(productId: number | undefined, shoppingListId: number | undefined) {

    //typescriptzeugs
    if(productId == undefined || shoppingListId == undefined) {
      return
    }

    this.apiService.postRequest({ "EKL_ID": shoppingListId, "PROD_ID": productId, "remove": true }, "/einkaufsliste/produkte")
      .subscribe(
        response => {
          this.getShoppinglists();
        }
      )
  }

  //markiert ein Produkt in einer Liste bei click auf "check"
  toggleProductFinished(product: ProductI, listId: number, value: boolean) {

    this.apiService.postRequest({"EKL_ID": listId, "PROD_ID": product.id, "abg": value}, "/einkaufsliste/produkte")
      .subscribe();

    //das if ist hier leider durch typescript bedingt
    if(
      this.managedList.list.find(item => item.id == listId)?.products?.find(item => item.product.id == product?.id) != undefined
    ) {
      //setzt den wert in der managedList
      // @ts-ignore
      this.managedList.list.find(item => item.id == listId).products.find(item => item.product.id == product.id).product.finished = value;
    }
  }

  //setzt das angeklickte Element auf Aktiv und holt alle weiteren, notwendigen daten
  onClick(id: number) {

    //bricht ab, wenn das Element bereits aktiv ist
    if (this.managedList.list.find(item => item.id == id)?.isActive) {
      return
    }

    this.managedList = this.listsItemHandler.setActive(id, this.managedList);

    this.apiService.postRequest({"EKL_ID": id}, "/einkaufsliste/produkte")
      .subscribe(
        response => {

          const listItem = this.managedList.list.find(item => item.id == id);
          if ( listItem ) {
            listItem.products = response.products.map((el: any) => {
              return {
                amount: el.menge,
                unit: el.einheit,
                product: {
                  id: el.PROD_ID,
                  isActive: undefined,
                  title: el.bezeichnung,
                  isIngredient: undefined,
                  finished: el.abg,
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
      );
  }

  //holt alle einkaufslisten die für den nutzer freigegeben sind
  getShoppinglists() {
    this.apiService.postRequest({}, "/benutzer/einkaufsliste")
      .subscribe(
        response => {

          //speichern der daten in managedlist
          this.managedList.list = response.lists.map((el: any) => {
            return {
              id: el.EKL_ID,
              isActive: false,
              title: el.bezeichnung,
              note: el.hinweis,
              timestamp: el.zeit,
              finished: el.abg,
              products: [],
            }
          });
        },
        error => {

          //der status 401 bedeutet der übermittelte Token ist nicht mehr gültig
          if(error.status == 401) {
            this.authenticationService.logOut();
          }
        }
      )
  };

}
