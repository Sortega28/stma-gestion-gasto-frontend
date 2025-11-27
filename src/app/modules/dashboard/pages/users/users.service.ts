import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment'; 

export interface Usuario {
  id: number;
  name: string;
  email: string;
  role: string;

  nombre?: string;
  apellidos?: string;
  rol?: string;
  password?: string;
  imagen?: string;
}

export interface UsersResponse {
  data: Usuario[];
  current_page: number;
  last_page: number;
  total: number;
}

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private apiUrl = `${environment.apiUrl}/users`;   // 🔥 YA NO ES LOCALHOST

  constructor(private http: HttpClient) {}

  getUsuarios(params: any): Observable<UsersResponse> {
    let httpParams = new HttpParams();

    Object.keys(params).forEach(key => {
      const value = params[key];
      if (value !== null && value !== undefined && value !== '') {
        httpParams = httpParams.set(key, value);
      }
    });

    return this.http.get<UsersResponse>(this.apiUrl, { params: httpParams });
  }

  private construirName(data: any): string {
    let nombre = (data.nombre || '').trim();
    let apellidos = (data.apellidos || '').trim();

    if (!nombre && apellidos) nombre = apellidos;
    if (!nombre && !apellidos) nombre = 'Usuario';

    return apellidos ? `${nombre} ${apellidos}` : nombre;
  }

  crearUsuario(data: any): Observable<any> {
    const payload = {
      name: this.construirName(data),
      email: data.email,
      password: data.password,
      role: data.rol
    };

    return this.http.post(this.apiUrl, payload);
  }

  actualizarUsuario(id: number, data: any): Observable<any> {
    const payload: any = {
      name: this.construirName(data),
      email: data.email,
      role: data.rol
    };

    if (data.password && data.password.trim()) {
      payload.password = data.password;
    }

    return this.http.put(`${this.apiUrl}/${id}`, payload);
  }

  eliminarUsuario(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
