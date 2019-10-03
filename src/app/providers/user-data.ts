import { Injectable } from '@angular/core';
import { Events } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import * as Keycloak_ from 'keycloak-js';

@Injectable({
  providedIn: 'root'
})
export class UserData {
  _favorites: string[] = [];
  HAS_LOGGED_IN = 'hasLoggedIn';
  HAS_SEEN_TUTORIAL = 'hasSeenTutorial';
  private keycloakAuth: any;
  constructor(
    public events: Events,
    public storage: Storage
  ) { }

  hasFavorite(sessionName: string): boolean {
    return (this._favorites.indexOf(sessionName) > -1);
  }

  addFavorite(sessionName: string): void {
    this._favorites.push(sessionName);
  }

  removeFavorite(sessionName: string): void {
    const index = this._favorites.indexOf(sessionName);
    if (index > -1) {
      this._favorites.splice(index, 1);
    }
  }

  login(username: string): Promise<any> {
    return this.storage.set(this.HAS_LOGGED_IN, true).then(() => {
      this.setUsername(username);
      return this.events.publish('user:login');
    });
  }
  kcLogin(username: string): Promise<any> {
    
      const config = {
        
      };
      const Keycloak = Keycloak_;
      this.keycloakAuth =  Keycloak(config);
      return new Promise(async (resolve, reject) => {
     try {
         this.keycloakAuth.init({
        onLoad: 'login-required',
        checkLoginIframe: false,
        adapter: 'cordova'
      }).success(() => {
        console.error('ssu', this.keycloakAuth.authenticated);
       // alert('ssu' + this.events);
         this.events.publish('user:login');
         resolve();
      })
      .error((e) => {
        console.error('"rr"', this.keycloakAuth.authenticated);
       // alert('"rr"' + e);
        this.events.publish('user:login');
        reject(e);
      });
    } catch (e) {
      reject(e);
    }
    });
  }

  signup(username: string): Promise<any> {
    return this.storage.set(this.HAS_LOGGED_IN, true).then(() => {
      this.setUsername(username);
      return this.events.publish('user:signup');
    });
  }

  kclogout(): Promise<any> {
    return this.storage.remove(this.HAS_LOGGED_IN).then(() => {
    this.keycloakAuth.logout();
    return this.storage.remove('username');
    }).then(() => {
      this.events.publish('user:logout');
    });
  }
  logout(): Promise<any> {
    return this.storage.remove(this.HAS_LOGGED_IN).then(() => {
      return this.storage.remove('username');
    }).then(() => {
      this.events.publish('user:logout');
    });
  }

  setUsername(username: string): Promise<any> {
    return this.storage.set('username', username);
  }

  getUsername(): Promise<string> {
    return this.storage.get('username').then((value) => {
      return value;
    });
  }

  isLoggedIn(): Promise<boolean> {
    return this.storage.get(this.HAS_LOGGED_IN).then((value) => {
      return value === true;
    });
  }

  checkHasSeenTutorial(): Promise<string> {
    return this.storage.get(this.HAS_SEEN_TUTORIAL).then((value) => {
      return value;
    });
  }
}
