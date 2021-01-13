import {
  MessageBody,
  ConnectedSocket,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets'
import { Message } from '@peek/core/model'
import { Socket } from 'socket.io'

@WebSocketGateway()
export class AppGateway {
  @SubscribeMessage('message')
  handleMessage(
    @ConnectedSocket() contact: Socket,
    @MessageBody() peerContact: Message
  ) {
    contact.broadcast.send(peerContact)
  }
}
