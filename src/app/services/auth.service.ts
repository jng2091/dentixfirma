import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  baseUrl = environment.baseUrl;

  constructor(private httpClient: HttpClient) { }

  authenticate(email, password) {

    return this.httpClient.post<{ token: string, expired: number, error: number }>(this.baseUrl + "/api/auth/token"
      , { Email: email, Password: password }
      , { headers: new HttpHeaders({ "No-Auth": "True" }) }
    );
  }

  extend() {
    return this.httpClient.get<{ token: string, expired: number, error: number }>(this.baseUrl + "/api/auth/extend");
  }

  change(ContrasenaActual: string, ContrasenaNueva: string) {
    return this.httpClient.post<{ idError: number }>(this.baseUrl + "/api/auth/change"
      , { ContrasenaActual: ContrasenaActual, ContrasenaNueva: ContrasenaNueva }
    );
  }
}
