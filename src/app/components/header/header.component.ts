import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from "../../services/authentication/authentication.service";
import {AppComponent} from "../../app.component";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less']
})
export class HeaderComponent implements OnInit {

  constructor(public authenticationService: AuthenticationService, public appComponent: AppComponent) { }

  ngOnInit(): void {
  }

}
