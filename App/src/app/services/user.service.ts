import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AuthService } from './auth.service';
import {Employee} from '../models/employee.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:8080/api/admin/clients';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`, // 🔐 Attach JWT Token
      'Content-Type': 'application/json',
    });
  }

  getAllUsers(page: number, size: number): Observable<{ content: User[], totalElements: number }> {
    let params = new HttpParams().set('page', page).set('size', size);

    return this.http.get<{ content: User[], totalElements: number }>(this.apiUrl, {
      headers: this.getAuthHeaders(),
      params,
    });
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  getUserSelf(): Observable<Employee> {
    return this.http.get<Employee>(`${this.apiUrl}/me`, { headers: this.getAuthHeaders() });
  }

  registerUser(user: any): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}`, user, { headers: this.getAuthHeaders() });
  }

  updateUser(userId: number, user: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${userId}`, user, { headers: this.getAuthHeaders() });
  }

  deleteUser(userId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${userId}`, { headers: this.getAuthHeaders() });
  }
}
