import { PeerCode } from '../peer-code'

export function peerCode(): string {
  function S4(): string {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1)
  }

  return `${S4()}${S4()}-${S4()}-${S4()}-${S4()}`
}

export function createPeerCode() {
  return toPeerCode(peerCode())
}

export function fromPeerCode({
  timeLow,
  timeMid,
  timeHiAndVersion,
  clockSecHiAndRes,
}: PeerCode): string {
  return `${timeLow}-${timeMid}-${timeHiAndVersion}-${clockSecHiAndRes}`
}

export function toPeerCode(code: string): PeerCode {
  const [timeLow, timeMid, timeHiAndVersion, clockSecHiAndRes] = code.split('-')
  return { timeLow, timeMid, timeHiAndVersion, clockSecHiAndRes }
}
