import { Identity } from '@peek/core/model'
import { EventEmitter, Injectable } from '@angular/core'

/**
 * @dynamic
 * @class IdentityStorage
 */
@Injectable()
export class IdentityStorage {
  static storageKey = 'identity'

  static value: Identity

  onUpdate: EventEmitter<Identity> = new EventEmitter<Identity>()

  store(value: Identity) {
    try {
      localStorage.setItem('identity', JSON.stringify(value))
    } catch {}

    this.onUpdate.emit(value)
  }

  getStoredValue(): Identity | null {
    try {
      return JSON.parse(localStorage.getItem('identity'))
    } catch {
      return null
    }
  }

  clearStorage() {
    try {
      localStorage.removeItem(IdentityStorage.storageKey)
    } catch {}
  }
}
