import 'jest-preset-angular';

Object.defineProperty(window, 'AudioContext', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    createScriptProcessor: jest.fn(),
    createMediaStreamSource: jest.fn(),
  })),
})

Object.defineProperty(window, 'RTCPeerConnection', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    localDescription: query,
    remoteDescription: query,
    close: jest.fn(),
    addTrack: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

const mockMediaDevices = {
  getUserMedia: jest.fn().mockImplementation((q) => {
    return new Promise(() => {})
  }),
}
;(window as any).navigator.mediaDevices = mockMediaDevices

const mockGetUserMedia = {
  getUserMedia: jest.fn().mockResolvedValue({} as MediaStream),
}
// navigator.getUserMedia = mockGetUserMedia.getUserMedia
