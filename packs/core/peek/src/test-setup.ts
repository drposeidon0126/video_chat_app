import 'jest-preset-angular'

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
    addEventListener: jest.fn(),
    close: jest.fn(),
  })),
})
