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
export enum PillColor {
  Green = 'green',
  Purple = 'purple',
  Blue = 'blue',
  Orange = 'orange',
}

export enum Expertise {
  Experienced = 'Experienced',
  Advanced = 'Advanced',
  Senior = 'Senior',
  Expert = 'Expert',
}

export interface Pill {
  color: PillColor;
  expertise: Expertise;
}
