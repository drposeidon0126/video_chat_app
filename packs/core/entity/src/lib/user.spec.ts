import { User } from './user'

describe('User', () => {
  it('should create user', () => {
    expect(new User(1, 'seek')).toBeDefined()
  })
  it('should create user instance', () => {
    expect(new User(2, 'John')).toBeInstanceOf(User)
  })
})
