/**
 * Mocks Window
 */

// WebRTC PeerConnection
Object.defineProperty(window, 'RTCPeerConnection', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    localDescription: query,
    remoteDescription: query,
    setLocalDescription: jest.fn(),
    setRemoteDescription: jest.fn(),
    close: jest.fn(),
    createOffer: jest.fn().mockResolvedValue({}),
    addTrack: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

// WebRTC RTCSessionDescription
Object.defineProperty(window, 'RTCSessionDescription', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({})),
})

// Navitator Permission
Object.defineProperty(window, 'navigator', {
  writable: true,
  value: {
    permissions: {
      query: jest.fn().mockResolvedValue({
        state: 'granted',
      }),
    },
  },
})
