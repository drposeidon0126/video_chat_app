import {
  MessageBody,
  ConnectedSocket,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets'
import { PeerAction, PeerOffer } from '@peek/core/model'
import { Socket } from 'socket.io'

@WebSocketGateway()
export class CraneGateway {
  @SubscribeMessage(PeerAction.Offer)
  restart(
    @ConnectedSocket() contact: Socket,
    @MessageBody() peekOffer: PeerOffer
  ) {
    console.log(peekOffer);

    contact.broadcast.emit(PeerAction.Offer, peekOffer)
  }
}
