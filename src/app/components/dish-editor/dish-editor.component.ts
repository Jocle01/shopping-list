import {Component, Input, OnInit} from '@angular/core';
import {DishI} from "../../models/dish";
import {FormBuilder} from "@angular/forms";
import {ProductI} from "../../models/product";
import {ApiService} from "../../services/api/api.service";
import {AuthenticationService} from "../../services/authentication/authentication.service";
import {DishListComponent} from "../../pages/dish-list/dish-list.component";

@Component({
  selector: 'app-dish-editor',
  templateUrl: './dish-editor.component.html',
  styleUrls: ['./dish-editor.component.less']
})
export class DishEditorComponent implements OnInit {

  //übergebene werte aus dish.component
  @Input() dish?: DishI;
  @Input() newItem?: boolean = false;

  //definiert die Formularfelder für Bearbeitung eines Elements
  form = this.formBuilder.group({
    title: "",
    time: "",
    difficulty: null,
    recipe: "",
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
    public dishListComponent: DishListComponent
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

  //hinzufügen eines Produktes zum Gericht anhand der Daten, welche im Produktformular stehen
  addProduct() {
    this.apiService.postRequest({ "GER_ID": this.dish?.id, "PROD_ID": this.productForm.value.productId, "menge": this.productForm.value.amount ?? 0, "einheit": this.productForm.value.unit ?? "" }, "/gericht/produkte")
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
    const title = this.form.value.title == '' ? this.dish?.title : this.form.value.title;
    const time = this.form.value.time == '' ? this.dish?.time : this.form.value.time;
    const difficulty = this.form.value.difficulty == null ? this.dish?.difficulty : this.form.value.difficulty;
    const recipe = this.form.value.recipe == '' ? this.dish?.recipe : this.form.value.recipe;

    //speichert das bearbeitete element. Bei newItem = true wird die id ausgelassen und ein neues Element wird erstellt
    this.apiService.postRequest( { "GER_ID": this.newItem ? null : this.dish?.id, "bez": title, "Rezept": recipe, "zube_dauer": time, "schwierig": difficulty, "remove": false }, "/gericht" )
      .subscribe(
        response => {
          this.dishListComponent.closeEditor();
        },
        error => {
          if (error.status == 401) {
            this.authenticationService.logOut();
          }
        })
  }
}
