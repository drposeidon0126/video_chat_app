export class PeekError extends Error {
  private _domain: string
  private _code: number
  private _userData: any

  constructor(domain: string, code: number, userData?: any) {
    super()
    this._domain = domain
    this._code = code
    this._userData = userData || {}
  }

  get domain() {
    return this._domain
  }

  get code() {
    return this._code
  }

  get userData() {
    return this._userData
  }

  get(key: string) {
    return this.userData[key]
  }

  static KEY = {
    ERROR: 'PeekErrorKeyError',
    MESSAGE: 'PeekErrorKeyMessage',
    RESOLUTION: 'PeekErrorKeyResolution',
  }
}
