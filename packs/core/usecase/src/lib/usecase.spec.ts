import { UseCase } from './usecase'


class MakeOffer extends UseCase<string, void> {
  async execute(params: string): Promise<void> {
    return Promise.resolve()
  }
}

const opt: RTCOfferOptions = {
  offerToReceiveAudio: true,
  offerToReceiveVideo: true,
}

describe('UseCase', () => {
  it('should work', async () => {
    const offer = new MakeOffer()
    return offer.execute('a').then((response) => {
      expect(response).toBeUndefined()
    })
  })
})
