export interface User {
  login: string
  name: string
  password?: string
  role: UserRole
}

export enum UserRole {
  admin,
  normal,
}
