import { MakeOffer } from './make-offer'

const opt: RTCOfferOptions = {
  offerToReceiveAudio: true,
  offerToReceiveVideo: true,
}

describe('MakeOffer', () => {
  let makeOffer: MakeOffer
  it('should create an instance', () => {
    makeOffer = new MakeOffer()
    const pc = new RTCPeerConnection()
    return makeOffer.execute({ pc, opt }).then((response) => {
      expect(response).toEqual({})
    })
  })
})
