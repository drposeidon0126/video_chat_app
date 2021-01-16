import {
  MessageBody,
  ConnectedSocket,
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets'
import { Socket } from 'socket.io'
import { Message } from '@peek/core/model'

@WebSocketGateway()
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
  contacts = new Map<string, string>()

  handleConnection(
    @ConnectedSocket() contact: Socket,
    @MessageBody() peerContact: string
  ) {
    this.contacts.set(contact.id, peerContact)
    const contacts = Array.from(this.contacts.values())
    console.log('connect: ', contact.id)
    console.log(contacts)

    contact.broadcast.emit('contacts', contacts)
    console.log(peerContact)
  }
  handleDisconnect(contact: Socket) {
    console.log('disconnect: ', contact.id)

    if (this.contacts.has(contact.id)) {
      this.contacts.delete(contact.id)
    }
  }
  @SubscribeMessage('offer')
  offer(client: Socket, payload: Partial<FormData>) {
    // this.data = { ...this.data, ...payload };
    // this.logger.log(`offer: ${JSON.stringify(payload)}.`);
    client.broadcast.emit('offer', payload);
  }
  @SubscribeMessage('message')
  handleMessage(
    @ConnectedSocket() contact: Socket,
    @MessageBody() peerContact: Message
  ) {
    contact.broadcast.send(peerContact)
  }
}
