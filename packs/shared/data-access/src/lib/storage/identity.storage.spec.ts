import { IdentityStorage } from './identity.storage'
import { Identity, uuid } from '@peek/core/model'

const testStorageKey = IdentityStorage.storageKey
const testIdentity: Identity = {
  code: '123',
  name: 'Gui',
}

describe('IdentityStorage', () => {
  const service = new IdentityStorage()
  const getCurr = () => JSON.parse(window.localStorage.getItem(testStorageKey))
  const secondTestIdentity: Identity = {
    code: uuid(),
    name: 'Seek',
  }

  beforeEach(() => {
    localStorage.setItem(testStorageKey, JSON.stringify(testIdentity))
  })

  afterEach(() => {
    window.localStorage.clear()
  })

  it('should create an instance', () => {
    expect(new IdentityStorage()).toBeTruthy()
  })

  it('should set the current auth code', () => {
    expect(getCurr()).toEqual(testIdentity)
    service.store(secondTestIdentity)
    expect(getCurr()).toEqual(secondTestIdentity)
  })

  it('should clear the stored auth data', () => {
    expect(getCurr()).not.toBeNull()
    service.clearStorage()
    expect(getCurr()).toBeNull()
  })

  it('should emit an event when set is called', () => {
    spyOn(service.onUpdate, 'emit')
    service.store(secondTestIdentity)
    expect(service.onUpdate.emit).toHaveBeenCalled()
    expect(service.onUpdate.emit).toHaveBeenCalledWith(secondTestIdentity)
  })
})
