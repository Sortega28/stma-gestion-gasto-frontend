import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SolicitudesService {

  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  // Obtener solicitudes con paginación y filtros
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

  // Obtener detalle
  getSolicitud(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/solicitudes/${id}`);
  }

  // Actualizar solicitud (PUT)
  updateSolicitud(id: number, body: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/solicitudes/${id}`, body);
  }

  // Validar MASIVO
  validarMasivo(ids: number[], estado: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/solicitudes/validar`, {
      ids,
      estado
    });
  }
}
