import { Room } from './room'
import { ID } from './type/id'
import { Role } from './util/role'

// export class User {
//   constructor(
//     public id: ID,
//     public username: string,
//     public roles: Role[] = [Role.Anonymous],
//     public name?: string
//   ) {}
// }

export interface ResetPassword {
  token: string
  expires: Date
}

export interface Name {
  first: string
  last: string
}
export interface CodeConfirm {
  code: string
  time: Date | null
}

export class User {
  id: number
  name: Name
  email: string
  username: string
  password: string
  isActive: boolean
  lastCode: CodeConfirm
  resetPassword?: ResetPassword
  rooms?: Room[]
}
