import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiUrl = 'https://localhost:7003/api/Auth';

  constructor(private http: HttpClient) { }

  /* ───────────── auth calls ───────────── */

  /** Register — role param optional (defaults to "User") */
  register(username: string, password: string, role = 'User') {
    return this.http.post(`${this.apiUrl}/register`, { username, password, role });
  }

  /** Login — now accepts role string from the dropdown */
  login(username: string, password: string, role: string) {
    return this.http
      .post<{ token: string }>(`${this.apiUrl}/login`, { username, password, role })
      .pipe(tap(res => localStorage.setItem('jwt', res.token)));
  }

  logout(): void {
    localStorage.removeItem('jwt');
  }

  /* ───────────── token helpers ───────────── */

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getToken(): string | null {
    return localStorage.getItem('jwt');
  }

  getRole(): string | null {
    const token = this.getToken();
    if (!token) return null;

    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload['role'] ?? null;          // assumes claim is "role"
  }

  /** true if the token contains the expected role */
  hasRole(role: string): boolean {
    return this.getRole() === role;
  }
}
