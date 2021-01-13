import { RequestPermission } from './request-permission'

describe('RequestPermission', () => {
  it('should create an instance', () => {
    expect(new RequestPermission()).toBeTruthy()
  })

  it('should create an instance', () => {
    const permission = new RequestPermission()
    permission.execute({ name: 'bluetooth' }).then((response) => {
      expect(response.state).toBe('granted')
    })
  })
})
