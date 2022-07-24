import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../modal/types';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private readonly _users = new BehaviorSubject<User[]>([]);
  readonly users$ = this._users.asObservable();
  constructor() {}

  addUser(user: User) {
    const previousUsers = this._users.value;
    this._users.next([...previousUsers, user]);
  }

  editUser(user: User) {
    const previousUsersFiltered = this._users.value.filter(
      (u) => u.id !== user.id
    );
    this._users.next([...previousUsersFiltered, user]);
  }

  deleteUser(id: string) {
    const previousUsersFiltered = this._users.value.filter((u) => u.id !== id);
    this._users.next([...previousUsersFiltered]);
  }
}
