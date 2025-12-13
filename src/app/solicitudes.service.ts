import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class SolicitudesService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getSolicitudes(page: number, perPage: number, filtros?: any): Observable<any> {
    let params = new HttpParams()
      .set('page', page)
      .set('perPage', perPage);

    if (filtros) {
      for (const key of Object.keys(filtros)) {
        params = params.set(key, filtros[key]);
      }
    }

    return this.http.get<any>(`${this.apiUrl}/solicitudes`, { params });
  }

  getSolicitud(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/solicitudes/${id}`);
  }

  updateSolicitud(id: number, body: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/solicitudes/${id}`, body);
  }

  validarMasivo(ids: number[], estado: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/solicitudes/validar`, {
      ids,
      estado
    });
  }
  crearSolicitud(body: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/solicitudes`, body);
  }
}
