import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment'; 

export interface EvolucionMensual {
  mes: string;
  total: number;
}

export interface TopProveedor {
  nombre: string;
  total: number;
}

export interface DashboardResumen {
  totalGasto: number;
  gastoMensual: number;
  ordenesActivas: number;
  topProveedor: TopProveedor | null;
  ultimasOrdenes: any[];
  evolucionMensual: EvolucionMensual[];
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getResumen(): Observable<DashboardResumen> {
    return this.http.get<DashboardResumen>(`${this.apiUrl}/dashboard/resumen`);
  }
}
