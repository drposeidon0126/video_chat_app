export class Code {
  uid: string[]
  constructor(code: string) {
    this.uid = code.split('-')
  }
}
