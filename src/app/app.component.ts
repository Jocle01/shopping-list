import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from "./services/authentication/authentication.service";
import {ApiService} from "./services/api/api.service";
import {CookieService} from "ngx-cookie-service";
import {HttpClient} from "@angular/common/http";

export const apiUrlRoot = "http://the-4elements.de:8000";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {
  title = 'shopping-list';

  userId: number | null;
  userName: string | undefined;

  constructor(
    private http: HttpClient,
    public authenticationService: AuthenticationService,
    private apiService: ApiService,
    private cookies: CookieService,
    ) {

    this.userId = null;
    this.userName = undefined;

  }

  setUsername(name: string) {
    this.userName = name;
  }

  //app kontrolliert beim initialen laden den Anmeldestatus anhand der Cookies
  ngOnInit(): void {
    const userId = this.cookies.get('ben_id');
    const token = this.cookies.get('token');

    if(userId == "" || token == "") {
      return
    }

    //einziger get request zur validierung des Anmeldestatuses
    this.http.get<any>(`${apiUrlRoot}/internal/authorization/${userId}/${token}`)
      .subscribe(
        response => {

          //setzen aller nötigen, globalen werte
          this.authenticationService.logIn();
          this.userId = Number(userId);
          this.userName = response.name;
        },
        error => {
          this.authenticationService.logOut();
        }
      );
  }
}
