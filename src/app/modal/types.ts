export enum Department {
  Development = 'Development',
  Marketing = 'Marketing',
}

export interface BaseUser {
  name: string;
  email: string;
  department: Department;
  created: string;
}

export interface User extends BaseUser {
  id: number;
}

export interface CreateUser extends BaseUser {}
export interface EditUser extends User {}
export interface DeleteUser {
  id: number;
}
