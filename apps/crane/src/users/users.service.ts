import { User, Role, AddPassword } from '@peek/core/entity'
import { Injectable } from '@nestjs/common'
import { uuid } from '@peek/core/model'

@Injectable()
export class UsersService {
  private readonly users: AddPassword<User>[] = [
    {
      id: 1,
      name: {
        first: 'Gui',
        last: 'Seek'
      },
      email: '',
      isActive: true,
      lastCode: {
        code: uuid(),
        time: new Date()
      },
      username: 'seek',
      // roles: [Role.Admin],
      password: 'demo123',
    },
    // {
    //   id: 2,
    //   username: 'peek',
    //   // roles: [Role.User],
    //   password: 'guess',
    // },
  ]

  async findOne(username: string): Promise<AddPassword<User> | undefined> {
    return this.users.find((user) => user.username === username)
  }
}
