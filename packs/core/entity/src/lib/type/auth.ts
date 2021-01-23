import { User } from '../user'

export type Auth = Pick<User, 'username'> & {
  password: string
}
