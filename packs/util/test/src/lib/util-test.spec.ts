import { RTCPeerMock, utilTest } from './util-test'

describe('utilTest', () => {
  let peerMock: RTCPeerMock

  beforeAll(async () => {
    peerMock = new RTCPeerMock()
  })

  it('should work', () => {
    expect(utilTest()).toEqual('util-test')
  })

  it('should create RTCPeer instance', () => {
    expect(peerMock).toBeDefined()
  })

})
