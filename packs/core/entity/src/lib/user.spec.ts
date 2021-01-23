import { User } from './user'

describe('User', () => {
  it('should create user', () => {
    expect(new User()).toBeDefined()
  })
  it('should create user instance', () => {
    expect(new User()).toBeInstanceOf(User)
  })
})
