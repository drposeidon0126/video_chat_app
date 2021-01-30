import {
  MessageBody,
  ConnectedSocket,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayDisconnect,
} from '@nestjs/websockets'
import { PeekAction, PeekPayload } from '@peek/core/model'
import { Server, Socket } from 'socket.io'
import { UseGuards } from '@nestjs/common'
import { MeetGuard } from './meet.guard'

@WebSocketGateway()
export class MeetGateway implements OnGatewayDisconnect {
  @WebSocketServer()
  server: Server

  @UseGuards(MeetGuard)
  @SubscribeMessage(PeekAction.CreateOrJoin)
  create(
    @ConnectedSocket() contact: Socket,
    @MessageBody() payload: PeekPayload
  ) {
    const room = this._room(payload)
    if (room.length === 0) {
      contact.join(payload.code)
      contact.emit(PeekAction.Created)
    } else if (room.length > 0 && room.length < 5) {
      contact.join(payload.code)
      contact.emit(PeekAction.Joined)
    } else {
      contact.emit(PeekAction.Full)
    }
  }

  @UseGuards(MeetGuard)
  @SubscribeMessage(PeekAction.Offer)
  restart(
    @ConnectedSocket() contact: Socket,
    @MessageBody() payload: PeekPayload
  ) {
    const room = contact.to(payload.code)
    room.broadcast.emit(PeekAction.Offer, payload)
  }

  private _room({ code }) {
    const adapter = this.server.sockets.adapter
    return adapter.rooms[code] ?? { length: 0 }
  }

  handleDisconnect(contact: Socket) {
    contact.broadcast.emit(PeekAction.Exited, contact.id)
    contact.leaveAll()
  }

  @SubscribeMessage('message')
  message(
    @ConnectedSocket() contact: Socket,
    @MessageBody() payload: PeekPayload
  ) {
    contact.emit('message', payload)
    contact.broadcast.emit('message', payload)
  }
}
