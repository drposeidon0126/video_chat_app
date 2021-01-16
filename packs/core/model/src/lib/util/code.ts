import { Code } from '../code'

export function code(): string {
  function S4(): string {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1)
  }

  return `${S4()}${S4()}-${S4()}-${S4()}-${S4()}`
}

export function createCode() {
  return stringToCode(code())
}

export function codeToString({
  timeLow,
  timeMid,
  timeHiAndVersion,
}: Code): string {
  return `${timeLow}-${timeMid}-${timeHiAndVersion}`
}

export function stringToCode(code: string): Code {
  const [timeLow, timeMid, timeHiAndVersion] = code.split('-')
  return { timeLow, timeMid, timeHiAndVersion }
}
