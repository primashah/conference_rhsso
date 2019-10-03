import { Component, ViewEncapsulation } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { UserData } from '../../providers/user-data';
import * as Keycloak_ from 'keycloak-js';
import { UserOptions } from '../../interfaces/user-options';


declare var Keycloak: any;
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  styleUrls: ['./login.scss'],
})
export class LoginPage {
  login: UserOptions = { username: '', password: '' };
  submitted = false;
  private keycloakAuth: any;
  constructor(
    public userData: UserData,
    public router: Router
   ) { }

  kcLogin() {
  alert("jifdosjfo")
    const config = {
      'url': 'https://sso-ssona.apps.na311.openshift.opentlc.com/auth',
      'realm': 'master',
      'clientId': 'login-app',
      credentials: {
      'secret': '7fc7f27e-4491-4635-a7c4-552712f7d7c4'
      }
    };
    let Keycloak = Keycloak_;
    this.keycloakAuth =  Keycloak(config);
    this.keycloakAuth.init({
      onLoad: 'login-required',
      checkLoginIframe: false,
      adapter: 'cordova'

    }).success(() => {
      console.error("ssu", this.keycloakAuth.authenticated)
      alert("ssu")
      this.router.navigateByUrl('/app/tabs/schedule');
    })
    .error((e) => {
      
      console.error("rr", this.keycloakAuth.authenticated)
      alert("rr" + e)
    });
  }
  onLogin(form: NgForm) {
    this.submitted = true;
    if (form.valid) {
      this.userData.kcLogin(this.login.username).then(() => {
        alert("after login")
        this.router.navigateByUrl('/app/tabs/schedule');
      }).catch (() => {
        alert("error")
      });
      //this.kcLogin();
      //this.router.navigateByUrl('/app/tabs/schedule');
    }
  }

  onSignup() {
    alert(this.keycloakAuth.authenticated);
    this.keycloakAuth.logout();
   // this.router.navigateByUrl('/signup');
  }
}
