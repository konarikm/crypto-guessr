import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { CryptoResponse } from "../model/crypto_response";

@Injectable({
  providedIn: "root",
})
export class CryptoService {
  constructor(private http: HttpClient) {}

  getData(cryptoID: string): Observable<CryptoResponse> {
    const url = `${environment.apiUrl}/${cryptoID}`;
    const headers = new HttpHeaders({
      "Accept-Encoding": "gzip",
      Authorization: `Bearer ${environment.apiKey}`,
    });
    return this.http.get<CryptoResponse>(url);
  }
}
