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
  handleDisconnect(contact: Socket) {
    contact.leaveAll()
  }
  @WebSocketServer()
  server: Server

  @UseGuards(new MeetGuard())
  @SubscribeMessage(PeekAction.CreateOrJoin)
  create(
    @ConnectedSocket() contact: Socket,
    @MessageBody() payload: PeekPayload
  ) {
    const room = this._getRoom(payload)
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

  @UseGuards(new MeetGuard())
  @SubscribeMessage(PeekAction.Offer)
  restart(
    @ConnectedSocket() contact: Socket,
    @MessageBody() payload: PeekPayload
  ) {
    const room = contact.to(payload.code)
    room.broadcast.emit(PeekAction.Offer, payload)
  }

  private _getRoom({ code }) {
    const adapter = this.server.sockets.adapter
    return adapter.rooms[code] ?? { length: 0 }
  }
}
