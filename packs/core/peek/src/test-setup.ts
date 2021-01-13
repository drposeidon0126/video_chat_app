import 'jest-preset-angular'

Object.defineProperty(navigator, 'mediaDevices', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    getUserMedia: jest.fn() as jest.Mock<MediaStream>
  }))
})

const mockGetUserMedia = {
  getUserMedia: jest.fn().mockResolvedValue({} as MediaStream),
}
