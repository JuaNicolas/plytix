import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CreateUser, DeleteUser, EditUser, User } from '../models/types';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private readonly _users = new BehaviorSubject<User[]>([]);
  readonly users$ = this._users.asObservable();

  constructor(private readonly httpClient: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.httpClient.get<User[]>(environment.url).pipe(
      catchError(() => of([])),
      tap((users) => this._users.next(users))
    );
  }

  addUser(user: CreateUser): Observable<User> {
    const previousUsers = this._users.value;
    return this.httpClient
      .post<User>(environment.url, user)
      .pipe(tap((user) => this._users.next([...previousUsers, user])));
  }

  editUser(user: EditUser): Observable<User> {
    return this.httpClient
      .patch<User>(`${environment.url}/${user.id}`, user)
      .pipe(
        tap(() => {
          const usersModified = this._users.value.map((u) =>
            u.id === user.id ? { ...u, ...user } : u
          );
          this._users.next([...usersModified]);
        })
      );
  }

  deleteUser(user: DeleteUser): Observable<null> {
    return this.httpClient.delete<null>(`${environment.url}/${user.id}`).pipe(
      tap(() => {
        const previousUsersFiltered = this._users.value.filter(
          (u) => u.id !== user.id
        );
        this._users.next([...previousUsersFiltered]);
      })
    );
  }
}
