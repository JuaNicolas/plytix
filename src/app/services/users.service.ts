import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CreateUser, User } from '../modal/types';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private readonly _users = new BehaviorSubject<User[]>([]);
  readonly users$ = this._users.asObservable();
  constructor(private readonly httpClient: HttpClient) {}

  addUser(user: CreateUser) {
    const previousUsers = this._users.value;
    return this.httpClient
      .post<User>(environment.url, user)
      .pipe(tap((user) => this._users.next([...previousUsers, user])));
  }

  editUser(user: User) {
    const previousUsersFiltered = this._users.value.filter(
      (u) => u.id !== user.id
    );
    this._users.next([...previousUsersFiltered, user]);
  }

  deleteUser(id: number) {
    const previousUsersFiltered = this._users.value.filter((u) => u.id !== id);
    this._users.next([...previousUsersFiltered]);
  }
}
