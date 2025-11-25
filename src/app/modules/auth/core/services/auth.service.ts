import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { User } from '../../core/models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  login(credentials: { email: string; password: string }) {
    return this.http.post<{ user: User; access_token: string }>(
      `${this.baseUrl}/login`,
      credentials
    );
  }

  logout() {
    return this.http.post(`${this.baseUrl}/logout`, {});
  }
}
