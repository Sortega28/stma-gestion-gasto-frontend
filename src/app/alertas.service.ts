import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AlertasService {

  private baseUrl = '/api/alertas';

  constructor(private http: HttpClient) { }

  getAlertas(filtros: any) {
    let params = new HttpParams();

    Object.keys(filtros).forEach(key => {
      if (filtros[key] !== null && filtros[key] !== '' && filtros[key] !== undefined) {
        params = params.set(key, filtros[key]);
      }
    });

    return this.http.get<any>(this.baseUrl, { params });
  }
}
