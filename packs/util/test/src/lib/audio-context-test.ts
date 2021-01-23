import 'jest-preset-angular'

Object.defineProperty(window, 'AudioContext', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    createDelay: jest.fn().mockReturnValue({
      delayTime: {
        value: null,
      },
    }),
    createGain: jest.fn().mockReturnValue({}),
    createBuffer: jest.fn().mockReturnValue({
      getChannelData: jest.fn()
    }),
    createAnalyser: jest.fn().mockReturnValue({}),
    createBufferSource: jest.fn().mockReturnValue({}),
    createScriptProcessor: jest.fn().mockReturnValue({
      connect: jest.fn(),
      addEventListener: jest.fn(),
      disconnect: jest.fn(),
    }),
    createMediaStreamSource: jest.fn().mockReturnValue({
      connect: jest.fn(),
      disconnect: jest.fn(),
    }),
  })),
})
