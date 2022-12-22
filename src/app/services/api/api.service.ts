import { Injectable } from '@angular/core';
import {apiUrlRoot} from "../../app.component";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {CookieService} from "ngx-cookie-service";

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
    }),
  };

  constructor(private http: HttpClient, private cookies: CookieService) {}

  //generischer post request, dessen body und url ergänzt werden können, um alle Endpunkte anzusprechen
  postRequest(body: any, url: string, noAuth: boolean = false) {

    //holt in cookies gespeicherte Werte für authentification
    const userId = this.cookies.get('ben_id');
    const token = this.cookies.get('token');

    const apiUrl = `${apiUrlRoot}${url}`;

    //setzt body.BEN_ID & body.token. Setzt nicht bei der Anmeldung (dafür muss noAuth = true sein
    if (!noAuth) {
      body.BEN_ID = userId;
      body.token = token;
    }

    //post request mit variablen gefüllt
    return this.http.post<any>(apiUrl, body, this.httpOptions);
  }

}
