import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';

import { UsuarioModel } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private URL: string = 'https://identitytoolkit.googleapis.com/v1/accounts:';
  private REGISTER_PATH: string = `signUp?key=${environment.API_KEY}`;
  private LOGIN_PATH: string = `signInWithPassword?key=${environment.API_KEY}`;

  private idToken: string;

  constructor(private http: HttpClient) {
    this.idToken = this.getToken();
  }

  public login(usuario: UsuarioModel) {
    const user = {
      email: usuario.email,
      password: usuario.password,
    };
    return this.http.post(this.URL + this.LOGIN_PATH, user)
      .pipe(
        map(response => {
          this.setToken(response['idToken']);
          return response;
        })
      );
  }

  public logout() {
    this.deleteLocalStorage('idToken');
  }

  public signup(usuario: UsuarioModel) {
    const authData = {
      email: usuario.email,
      password: usuario.password,
      returnSecureToken: true
    };
    return this.http.post(this.URL + this.REGISTER_PATH, authData)
      .pipe(
        map(response => {
          this.setToken(response['idToken']);
          return response;
        })
      );
  }

  private setToken(idToken: string): void {
    this.idToken = idToken;
    const hoy = new Date();
    hoy.setSeconds(3600);
    this.saveLocalStorage('idToken', idToken);
    this.saveLocalStorage('exp', hoy.getTime().toString());
  }

  private getToken(): string {
    let token: string = this.getLocalStorage('idToken');
    if (token)
      return token;
    return '';
  }

  public saveLocalStorage(key: string, value: string): void {
    localStorage.setItem(key, value);
  }

  public getLocalStorage(key: string): string {
    return localStorage.getItem(key);
  }

  public deleteLocalStorage(key: string): void {
    localStorage.removeItem(key);
  }

  public isAuthenticated(): boolean {
    if (this.idToken.length <= 1) return false;

    const time = Number(this.getLocalStorage('exp'));
    const exp = new Date();
    exp.setTime(time);

    if (exp > new Date()) return true;

    return false;
  }
}
