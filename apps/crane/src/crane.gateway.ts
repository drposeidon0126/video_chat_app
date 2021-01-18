import {
  MessageBody,
  ConnectedSocket,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets'
import { PeerAction, PeerOffer } from '@peek/core/model'
import { Server, Socket } from 'socket.io'

@WebSocketGateway()
export class CraneGateway {
  @WebSocketServer()
  server: Server

  @SubscribeMessage(PeerAction.Offer)
  restart(
    @ConnectedSocket() contact: Socket,
    @MessageBody() peekOffer: PeerOffer
  ) {
    contact.broadcast.emit(PeerAction.Offer, peekOffer)
  }
}
