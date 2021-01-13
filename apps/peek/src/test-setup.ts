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
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

const mockGetUserMedia = {
  getUserMedia: jest.fn().mockResolvedValue({} as MediaStream),
}
// navigator.getUserMedia = mockGetUserMedia.getUserMedia
