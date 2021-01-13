import 'jest-preset-angular';

Object.defineProperty(navigator, 'mediaDevices', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    getUserMedia: jest.fn() as jest.Mock<MediaStream>
  }))
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

const mockGetUserMedia = {
  getUserMedia: jest.fn().mockResolvedValue({} as MediaStream),
}
// navigator.getUserMedia = mockGetUserMedia.getUserMedia
