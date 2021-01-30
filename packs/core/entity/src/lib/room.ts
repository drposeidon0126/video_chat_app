import { User } from './user'

export class Room {
  id: string
  uri: string
  name: string
  topic: string
  users?: User[]
}
