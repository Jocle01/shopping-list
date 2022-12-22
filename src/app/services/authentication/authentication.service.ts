import { Injectable } from '@angular/core';
import {CookieService} from "ngx-cookie-service";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private cookies: CookieService) { }

  //wert wird von den 3 Seiten genutzt um den Anmeldestatus zu prüfen
  public loggedIn = false;

  logIn() {
    this.loggedIn = true;
  }

  logOut() {
    this.loggedIn = false;
    this.cookies.deleteAll();
  }
}
