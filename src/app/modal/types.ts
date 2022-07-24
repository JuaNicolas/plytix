export enum Department {
  Development = 'Development',
  Marketing = 'Marketing',
}

export interface BaseUser {
  name: string;
  email: string;
  department: Department;
}

export interface User extends BaseUser {
  id: string;
}

export interface CreateUser extends BaseUser {}
export interface EditUser extends User {}
export interface DeleteUser {
  id: string;
}
