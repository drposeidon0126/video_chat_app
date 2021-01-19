import { PeekError } from '@peek/core/model'
import { UseCase } from './usecase'

export class CreatePeer extends UseCase<RTCConfiguration, RTCPeerConnection> {
  async execute(configuration: RTCConfiguration): Promise<RTCPeerConnection> {
    try {
      return new RTCPeerConnection(configuration)
    } catch (error) {
      throw new PeekError('create-peer', 0)
    }
  }
}
