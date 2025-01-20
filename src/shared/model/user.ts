export interface User {
  username: string
  name: string
  password?: string
  role: UserRole
}

export enum UserRole {
  admin,
  normal,
}
