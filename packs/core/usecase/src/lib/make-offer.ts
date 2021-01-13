import { UseCase } from "./usecase"

class OfferParam {
  constructor(public pc: RTCPeerConnection, public opt: RTCOfferOptions) {}
}

export class MakeOffer extends UseCase<OfferParam, RTCSessionDescription> {
  async execute({ pc, opt }: OfferParam): Promise<RTCSessionDescription> {
    return pc.createOffer(opt).then((offer) => {
      const description = new RTCSessionDescription(offer)
      pc.setLocalDescription(description)
      return description
    })
  }
}
