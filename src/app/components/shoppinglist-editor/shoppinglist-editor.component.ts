import {Component, Input, OnInit} from '@angular/core';
import {ShoppinglistI} from "../../models/shoppinglist";
import {FormBuilder} from "@angular/forms";
import {ApiService} from "../../services/api/api.service";
import {AuthenticationService} from "../../services/authentication/authentication.service";
import {ShoppinglistListComponent} from "../../pages/shoppinglist-list/shoppinglist-list.component";
import {ProductI} from "../../models/product";

@Component({
  selector: 'app-shoppinglist-editor',
  templateUrl: './shoppinglist-editor.component.html',
  styleUrls: ['./shoppinglist-editor.component.less']
})
export class ShoppinglistEditorComponent implements OnInit {

  //übergebene werte aus shoppinglist.component
  @Input() shoppinglist?: ShoppinglistI;
  @Input() newItem?: boolean = false;

  //definiert die Formularfelder für Bearbeitung eines Elements
  form = this.formBuilder.group({
    title: "",
    note: "",
  });

  //definiert weiteres Formular für Produkte
  productForm = this.formBuilder.group({
    productId: null,
    amount: null,
    unit: "",
  });

  //Objekt mit flags für exception handling
  inputError: {
    title: boolean,
  }

  //liste aller produkte für die auswahl im produktformular
  allProducts: Array<ProductI> = [];

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private authenticationService: AuthenticationService,
    public shoppinglistListComponent: ShoppinglistListComponent,
  ) {
    this.inputError = {
      title: false,
    }
  }

  ngOnInit(): void {
    this.getProducts();
  }

  //holt alle produkte
  getProducts() {
    this.apiService.postRequest({}, "/produkte")
      .subscribe(
        response => {

          //speichern der daten in allProducts
          this.allProducts = response.products.map((el: any) => {
            if(!el.ist_zut) {
              return
            }

            return {
              id: el.PROD_ID,
              isActive: false,
              title: el.bez,
              isIngredient: undefined,
              finished: undefined,
              properties: undefined,
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

  //hinzufügen eines Produktes zur Liste anhand der Daten, welche im Produktformular stehen
  addProduct() {
    this.apiService.postRequest({ "EKL_ID": this.shoppinglist?.id, "PROD_ID": this.productForm.value.productId, "menge": this.productForm.value.amount ?? 0, "einheit": this.productForm.value.unit ?? "", "remove": false, "abg": false }, "/einkaufsliste/produkte")
      .subscribe(
        response => {
        },
        error => {
          if (error.status == 401) {
            this.authenticationService.logOut();
          }
        }
      );
  }

  //Wird beim senden des Forms aufgerufen
  onSubmit() {
    if(this.newItem && this.form.value.title == '') {
      this.inputError.title = true;
      return
    }

    //setzt nicht im formular gesetzte werte auf die alten werte
    const title = this.form.value.title == '' ? this.shoppinglist?.title : this.form.value.title;
    const note = this.form.value.note == '' ? this.shoppinglist?.note : this.form.value.note;

    //speichert das bearbeitete element. Bei newItem = true wird die id ausgelassen und ein neues Element wird erstellt
    this.apiService.postRequest({ "EKL_ID": this.newItem ? null : this.shoppinglist?.id, "hinweis": note, "bezeichnung": title }, "/benutzer/einkaufsliste")
      .subscribe(
        response => {
          this.shoppinglistListComponent.closeEditor();
        },
        error => {
          if (error.status == 401) {
            this.authenticationService.logOut();
          }
        })
  }

}
