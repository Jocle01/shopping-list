import { Component, OnInit } from '@angular/core';
import { FormBuilder } from "@angular/forms";
import {ApiService} from "../../services/api/api.service";
import {CookieService} from "ngx-cookie-service";
import {AuthenticationService} from "../../services/authentication/authentication.service";
import {AppComponent} from "../../app.component";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit {

  //definiert den Aufbau des Anmeldeformulars
  loginForm = this.formBuilder.group({
    userId: null,
    password: ''
  });

  //Objekt mit flags für exception handling
  inputError: {
    id: boolean,
    pw: boolean,
    credentials: boolean,
  }

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private cookies: CookieService,
    private authenticationService: AuthenticationService,
    private appComponent: AppComponent
  ) {
    this.inputError = {
      id: false,
      pw: false,
      credentials: false,
    }
  }

  ngOnInit(): void {
  }

  //Wird beim senden des Forms aufgerufen
  onSubmit() {
    this.inputError.credentials = false;

    const userId = Number(this.loginForm.value.userId);
    const password = this.loginForm.value.password;

    //Exceptionhandling
    if ( userId == null || password == "") {
      if ( userId == null ) {
        this.inputError.id = true;
      }

      if ( password == "" ) {
        this.inputError.pw = true;
      }

      return
    }

    if ( !userId || !password) {
      return;
    }

    //post mit noAuth = true. Dies ist der post zur anmeldung
    this.apiService.postRequest({ "BEN_ID": userId, "password": password }, "/internal/authorization", true)
      .subscribe(
        (response) => {

          this.cookies.set('ben_id', response.BEN_ID.toString())
          this.cookies.set('token', response.token)

          this.appComponent.setUsername(response.name);

          //einloggen bei success
          this.authenticationService.logIn();
        },
        (error) => {

          //ausloggen bei error
          this.authenticationService.logOut();

          //der status 401 bedeutet der übermittelte Token ist nicht mehr gültig
          if (error.status == 401) {
            this.inputError.credentials = true;
          }
        }
      );
  }
}
