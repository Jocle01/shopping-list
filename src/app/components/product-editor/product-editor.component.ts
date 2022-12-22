import {Component, Input, OnInit, Output} from '@angular/core';
import {ProductI} from "../../models/product";
import {FormBuilder} from "@angular/forms";
import {ApiService} from "../../services/api/api.service";
import {AuthenticationService} from "../../services/authentication/authentication.service";
import {ProductListComponent} from "../../pages/product-list/product-list.component";

@Component({
  selector: 'app-product-editor',
  templateUrl: './product-editor.component.html',
  styleUrls: ['./product-editor.component.less']
})
export class ProductEditorComponent implements OnInit {

  //übergebene werte aus product.component
  @Input() product?: ProductI;
  @Input() newItem?: boolean = false;

  //definiert die Formularfelder für Bearbeitung eines Elements
  form = this.formBuilder.group({
    title: "",
    isIngredient: true,
    properties: [],
  });

  //Objekt mit flags für exception handling
  inputError: {
    title: boolean,
  }

  //liste aller eigenschaften
  allProperties: Array<{id: number, name: string}> = [];

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private authenticationService: AuthenticationService,
    public productListComponent: ProductListComponent
  ) {
    this.inputError = {
      title: false,
    }
  }

  ngOnInit() {
    this.getProperties();
  }

  checkPropInProduct(id: number) {
    return !!this.product?.properties?.find(item => item?.id == id);
  }

  //holt alle Produkteigenschaften
  getProperties() {
    this.apiService.postRequest({}, "/eigenschaften")
      .subscribe(
        response => {
          this.allProperties = response.eiglst.map((el: any) => {
            return {
              id: el.EIG_ID,
              name: el.eig,
            }
          })
        },
    error => {

          //der status 401 bedeutet der übermittelte Token ist nicht mehr gültig
          if (error.status == 401) {
            this.authenticationService.logOut();
          }
        }
      )
  }

  //Wird beim senden des Forms aufgerufen
  onSubmit() {

    if(this.newItem && this.form.value.title == '') {
        this.inputError.title = true;
        return
    }

    //setzt nicht im formular gesetzte werte auf die alten werte
    const title = this.form.value.title == '' ? this.product?.title : this.form.value.title;

    //speichert das bearbeitete element. Bei newItem = true wird die id ausgelassen und ein neues Element wird erstellt
    this.apiService.postRequest({ "PROD_ID": this.newItem ? null : this.product?.id, "bez": title, "ist_zut": this.form.value.isIngredient, "remove": false }, "/produkte")
      .subscribe(
        response => {
          this.productListComponent.closeEditor();
        },
        error => {

          //der status 401 bedeutet der übermittelte Token ist nicht mehr gültig
          if (error.status == 401) {
            this.authenticationService.logOut();
          }
        }
      );
  }
}
