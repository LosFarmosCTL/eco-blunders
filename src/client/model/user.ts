export interface User {
  login: string
  name: string
  role: UserRole
}

export enum UserRole {
  admin,
  normal,
}
