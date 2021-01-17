import { UseCase } from './usecase'

export class PickContacts implements UseCase<ContactProperty[], ContactInfo> {
  private _props: ContactProperty[] = ['name', 'email', 'tel', 'icon']

  execute(props: ContactProperty[] = []): Promise<ContactInfo> {
    if (this._supported) {
      try {
        return navigator.contacts.select(
          props && !!props.length ? props : this._props,
          {
            multiple: true,
          }
        )
      } catch (ex) {
        // Handle any errors here.
      }
    }
  }

  private _supported() {
    return 'contacts' in navigator && 'ContactsManager' in window
  }
}

declare global {
  interface ContactInfo {
    address: any
    email: string
    icon: Blob
    name: string
    tel: string
  }
  interface ContactsSelectOptions {
    multiple: boolean
  }
  /**
   * @interface ContactsManager
   *
   * @name Contact Picker API
   * @description Unofficial Proposal Draft, 2 January 2020
   * @see https://wicg.github.io/contact-api/spec
   */
  interface ContactsManager {
    getProperties(): Promise<ContactProperty>
    select(
      properties: ContactProperty[],
      options?: ContactsSelectOptions
    ): Promise<ContactInfo>
  }
  interface Navigator {
    /** Provides access to the device contacts database. */
    readonly contacts: ContactsManager
  }
  type ContactProperty = 'address' | 'email' | 'icon' | 'name' | 'tel'
}
