import {
  MessageBody,
  ConnectedSocket,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets'
import { Socket } from 'socket.io'
import { Message } from '@peek/core/model'

@WebSocketGateway()
export class CraneGateway {
  @SubscribeMessage('message')
  handleMessage(
    @ConnectedSocket() contact: Socket,
    @MessageBody() peerContact: Message
  ) {
    contact.broadcast.send(peerContact)
  }
}
