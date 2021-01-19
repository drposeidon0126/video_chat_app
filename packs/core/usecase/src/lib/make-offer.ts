import { OfferParam } from '@peek/core/model'
import { PeekError } from '@peek/core/model'
import { UseCase } from './usecase'

export class MakeOffer extends UseCase<OfferParam, RTCSessionDescription> {
  async execute({ pc, opt }: OfferParam): Promise<RTCSessionDescription> {
    try {
      return pc.createOffer(opt).then(async (offer) => {
        const description = new RTCSessionDescription(offer)
        await pc.setLocalDescription(description)
        return description
      })
    } catch (error) {
      throw new PeekError('make-offer', 1, pc.peerIdentity)
    }
  }
}
