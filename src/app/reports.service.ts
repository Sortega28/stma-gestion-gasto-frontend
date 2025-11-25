import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportesService {

  private baseUrl = environment.apiUrl; 

  constructor(private http: HttpClient) {}

  // GET /api/reportes  → datos para la tabla/gráficas
  getReportes(filtros: any): Observable<any> {
    let params = new HttpParams();

    if (filtros.desde)     params = params.set('desde', filtros.desde);
    if (filtros.hasta)     params = params.set('hasta', filtros.hasta);
    if (filtros.estado)    params = params.set('estado', filtros.estado);
    if (filtros.objeto)    params = params.set('objeto', filtros.objeto);
    if (filtros.unidad)    params = params.set('unidad', filtros.unidad);
    if (filtros.proveedor) params = params.set('proveedor', filtros.proveedor);

    return this.http.get<any>(`${this.baseUrl}/reportes`, { params });
  }

  // GET /api/reportes/pdf → descarga PDF
  descargarPdf(filtros: any): Observable<Blob> {
    let params = new HttpParams();

    if (filtros.desde)     params = params.set('desde', filtros.desde);
    if (filtros.hasta)     params = params.set('hasta', filtros.hasta);
    if (filtros.estado)    params = params.set('estado', filtros.estado);
    if (filtros.objeto)    params = params.set('objeto', filtros.objeto);
    if (filtros.unidad)    params = params.set('unidad', filtros.unidad);
    if (filtros.proveedor) params = params.set('proveedor', filtros.proveedor);

    return this.http.get(`${this.baseUrl}/reportes/pdf`, {
      params,
      responseType: 'blob'
    });
  }

  // GET /api/reportes/excel → descarga Excel
  descargarExcel(filtros: any): Observable<Blob> {
    let params = new HttpParams();

    if (filtros.desde)     params = params.set('desde', filtros.desde);
    if (filtros.hasta)     params = params.set('hasta', filtros.hasta);
    if (filtros.estado)    params = params.set('estado', filtros.estado);
    if (filtros.objeto)    params = params.set('objeto', filtros.objeto);
    if (filtros.unidad)    params = params.set('unidad', filtros.unidad);
    if (filtros.proveedor) params = params.set('proveedor', filtros.proveedor);

    return this.http.get(`${this.baseUrl}/reportes/excel`, {
      params,
      responseType: 'blob'
    });
  }
}
