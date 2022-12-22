import { Component, OnInit } from '@angular/core';
import {ProductI} from "../../models/product";
import {LitsItemHandlerService} from "../../services/lists-item-handler/lits-item-handler.service";
import {ApiService} from "../../services/api/api.service";
import {AuthenticationService} from "../../services/authentication/authentication.service";
import {PropertyI} from "../../models/property";

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.less']
})
export class ProductListComponent implements OnInit {

  //liste mit activeId zur identifizierung des aktuell ausgewählten elements
  managedList: {
    activeItemId: number | undefined;
    list: Array<ProductI>;
  };

  //zubearbeitendes Listenelement
  editorProduct: ProductI | undefined = undefined;

  //flags für editor (editor offen und neuer Eintrag)
  editor: boolean = false;
  newItem: boolean = false;

  constructor(
    public listsItemHandler: LitsItemHandlerService,
    private apiService: ApiService,
    public authenticationService: AuthenticationService,
  ) {
    this.managedList = {
      activeItemId: undefined,
      list: [],
    }
  }

  ngOnInit(): void {
    this.getProducts();
  }

  //öffnet editor für NEUEN Eintrag
  newListitem() {
    this.newItem = true;
    this.editor = true
  }

  //öffnet editor mit zubearbeitendem Produkt. Wird in product aufgerufen.
  editProduct(product: ProductI | undefined) {
    if (!product) {return};
    this.newItem = false;
    this.editorProduct = product;
    this.editor = true;
  }

  //markiert ein als erledigt bzw. nicht erledigt. Wird in shoppinglist aufgerufen
  deleteProduct(product: ProductI | undefined) {
    this.apiService.postRequest( { "PROD_ID": product?.id, "remove": true}, "/produkte")
      .subscribe(
        response => {
          this.getProducts();
        },
        error => {
          if(error.status == 401) {
            this.authenticationService.logOut();
          }
        }
      )
  }

  //löscht ein Gericht. Wird in dish aufgerufen
  closeEditor() {
    this.editor = false;
    this.newItem = false;
    this.editorProduct = undefined;
    this.getProducts();
  }

  //kümmert sich um das auswählen von eigenschaften im Bearbeitungsmodus
  togglePropertie(prop: PropertyI, productId: number | undefined) {

    if (productId == undefined) {
      return
    }

    const product = this.managedList.list.find(item => item.id == productId);

    //schaut ob die Eigenschaft dem Produkt zugewiesen ist
    const propInProduct = !!product?.properties?.find(item => item?.id == prop.id);

    //löscht oder (elseIf) fügt Eigenschaft der managedList hinzu
    if(propInProduct && product) {
      product.properties = product.properties?.map(item => {
        if (prop?.id != item?.id) {
          return item;
        }

        return
      })
    } else if ( product ) {
      product.properties.push(prop);
    }

    //post zum aktualisieren der daten
    this.apiService.postRequest( { "PROD_ID": productId, "EIG_ID": prop.id, "remove": propInProduct }, "/produkte/eigenschaften" )
      .subscribe(
        response => {

        },
        error => {
          if(error.status == 401) {
            this.authenticationService.logOut();
          }
        }
      );
  }


  //setzt das angeklickte Element auf Aktiv und holt alle weiteren, notwendigen daten
  onClick(id: number) {

    //bricht ab, wenn das Element bereits aktiv ist
    if (this.managedList.list.find(item => item.id == id)?.isActive) {
      return
    }

    this.managedList = this.listsItemHandler.setActive(id, this.managedList);

    this.apiService.postRequest({ "PROD_ID": id }, '/produkte/eigenschaften')
      .subscribe(
        response => {
          const listItem = this.managedList.list.find(item => item.id == id);
          if ( listItem ) {
            listItem.properties = response.eig_lst.map((el: any) => {
              return {
                id: el.EIG_ID,
                name: el.eig
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

  //holt alle produkte
  getProducts() {
    this.apiService.postRequest({}, "/produkte")
      .subscribe(
        response => {

          //speichern der daten in managedlist
          this.managedList.list = response.products.map((el: any) => {
            return {
              id: el.PROD_ID,
              isActive: false,
              title: el.bez,
              isIngredient: el.ist_zut,
              finished: undefined,
              properties: [],
            }
          });
        },
        error => {

          //der status 401 bedeutet der übermittelte Token ist nicht mehr gültig
          if(error.status == 401) {
            this.authenticationService.logOut();
          }
        }
      );
  };

}
