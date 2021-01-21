import 'jest-preset-angular'
export function utilTest() {
  return 'util-test'
}
export class RTCPeerMock {
  protected conn: RTCPeerConnection

  constructor() {
    this.conn = new RTCPeerConnection()
    this.conn.addEventListener = (evt: string) => this.addEventListener(evt)
    this.conn.onconnectionstatechange = (event: Event) =>
      this.onConnectionStateChange()
    this.conn.onicecandidate = (event: RTCPeerConnectionIceEvent) =>
      this.onIceCandidate(event)
  }

  private onConnectionStateChange() {
    console.log('onConnectionStateChange')
  }

  private onIceCandidate(event: RTCPeerConnectionIceEvent) {
    console.log('onIceCandidate')
  }

  private addEventListener(event: string) {
    console.log('addEventListener')
  }
}

const mockGeolocation = {
  getCurrentPosition: jest.fn(),
  watchPosition: jest.fn(),
}
;(global as any).navigator.geolocation = mockGeolocation

const mockMediaDevices = {
  getUserMedia: jest.fn().mockImplementation((q) => {
    return new Promise(() => {})
  }),
}
;(window as any).navigator.mediaDevices = mockMediaDevices

Object.defineProperty(window, 'RTCPeerConnection', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    localDescription: jest.fn(),
    setLocalDescription: jest.fn(),
    remoteDescription: jest.fn(),
    setRemoteDescription: jest.fn(),
    createOffer: jest.fn(),
    createAnswer: jest.fn(),
    addTrack: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
    close: jest.fn(),
  })),
})

Object.defineProperty(window, 'SignalingChannel', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    send: jest.fn(),
    on: jest.fn(),
  })),
})

Object.defineProperty(window, 'AudioContext', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    createScriptProcessor: jest.fn(),
    createMediaStreamSource: jest.fn(),
  })),
})
