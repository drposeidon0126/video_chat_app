import { PeekCode } from '../code'

export function peekCode(): string {
  function S4(): string {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1)
  }

  return `${S4()}${S4()}-${S4()}-${S4()}-${S4()}`
}

export function createPeekCode() {
  return toPeekCode(peekCode())
}

export function fromPeekCode({
  timeLow,
  timeMid,
  timeHiAndVersion,
  clockSecHiAndRes,
}: PeekCode): string {
  return `${timeLow}-${timeMid}-${timeHiAndVersion}-${clockSecHiAndRes}`
}

/**
 * Convert an string value to `PeekCode` Object
 * @param {string} code
 * @returns {PeekCode}
 */
export function toPeekCode(code: string): PeekCode {
  const [timeLow, timeMid, timeHiAndVersion, clockSecHiAndRes] = (code ?? '').split('-')
  return new PeekCode(timeLow, timeMid, timeHiAndVersion, clockSecHiAndRes)
}

/**
 * Check if value is an instance of `PeekCode`
 * or at least haven the same properties
 * @param {(PeekCode | object)} peekCode
 * @returns boolean
 */
export function isPeekCode(peekCode: PeekCode | object | string) {
  if (peekCode instanceof PeekCode) return true
  const props = ['timeLow', 'timeMid', 'timeHiAndVersion', 'clockSecHiAndRes']
  const hasProps = props.filter((p) => Object.keys(peekCode).indexOf(p) > -1)
  return props.length === hasProps.length
}

/**
 * Check if value matches with `PeekCode` format (using RegExp)
 * @param {(string | PeekCode)} peekCode
 * @returns boolean
 */
export function validatePeekCode(code: string | PeekCode) {
  const str = isPeekCode(code) ? fromPeekCode(code as PeekCode) : String(code)
  return /[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}/.test(str)
}
