const defaultConstraints: MediaStreamConstraints = {
  audio: {
    channelCount: {
      ideal: 2,
    },
    echoCancellation: true,
    frameRate: {
      ideal: 22000,
    },
  },
  video: {
    width: {
      min: 480,
      max: 1280,
      ideal: 1280,
    },
    height: {
      min: 320,
      max: 720,
      ideal: 720,
    },
    facingMode: {
      ideal: 'user',
    },
    frameRate: {
      ideal: 60,
      min: 10,
    },
  },
}
export const getMedia = (constraints?: MediaStreamConstraints) => {
  return navigator.mediaDevices.getUserMedia(
    constraints ? constraints : defaultConstraints
  )
}
