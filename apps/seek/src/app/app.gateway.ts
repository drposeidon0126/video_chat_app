import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets'
import { Message } from '@peek/core/model'
import { Socket } from 'socket.io'

@WebSocketGateway()
export class AppGateway implements OnGatewayConnection {
  handleConnection(
    @ConnectedSocket() contact: Socket,
    @MessageBody() peerContact: Message
  ) {
    contact.emit('id', contact.id)
  }
  @SubscribeMessage('message')
  handleMessage(
    @ConnectedSocket() contact: Socket,
    @MessageBody() peerContact: Message
  ) {
    contact.emit('message', peerContact)
    contact.broadcast.send(peerContact)
  }
}
