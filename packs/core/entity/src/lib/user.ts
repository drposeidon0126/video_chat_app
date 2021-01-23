import { ID } from './type/id'
import { Role } from './util/role'

export class User {
  constructor(
    public id: ID,
    public username: string,
    public roles: Role[] = [Role.Anonymous],
    public name?: string
  ) {}
}
