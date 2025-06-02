import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private http = inject(HttpClient);

  login(credentials: LoginRequest): Observable<User> {
    if (!this.http) {
      console.error('HttpClient is undefined in AuthService');
      return throwError(() => new Error('HTTP client is not available'));
    }

    return this.http.post<User>(`${this.apiUrl}/auth/login`, credentials)
      .pipe(
        catchError(error => {
          console.error('Error in login request:', error);
          return throwError(() => error);
        })
      );
  }
}
