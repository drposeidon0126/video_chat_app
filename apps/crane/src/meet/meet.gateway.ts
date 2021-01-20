import {
  MessageBody,
  ConnectedSocket,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets'
import { PeekAction, PeekPayload } from '@peek/core/model'
import { Server, Socket } from 'socket.io'
import { UseGuards } from '@nestjs/common'
import { MeetGuard } from './meet.guard'

@WebSocketGateway()
export class MeetGateway {
  @WebSocketServer()
  server: Server

  @UseGuards(new MeetGuard())
  @SubscribeMessage(PeekAction.Offer)
  restart(
    @ConnectedSocket() contact: Socket,
    @MessageBody() payload: PeekPayload
  ) {
    contact.broadcast.emit(PeekAction.Offer, payload)
  }

  // @SubscribeMessage(PeekAction.CreateOrJoin)
  // createOrJoin(
  //   @ConnectedSocket() contact: Socket,
  //   @MessageBody() peerContact: string
  // ) {
  //   console.log('create or join to room ', peerContact)

  //   var myMeet = this.server.sockets.adapter.rooms[peerContact] || { length: 0 }
  //   var numContacts = myMeet.length

  //   console.log(peerContact, ' has ', numContacts, ' clients')

  //   if (numContacts == 0) {
  //     contact.join(peerContact)
  //     contact.emit(PeekAction.Created, peerContact)
  //   } else if (numContacts == 1) {
  //     contact.join(peerContact)
  //     contact.emit(PeekAction.Joined, peerContact)
  //   } else {
  //     contact.emit(PeekAction.Full, peerContact)
  //   }
  // }

  // @SubscribeMessage(PeekAction.Ready)
  // ready(
  //   @ConnectedSocket() contact: Socket,
  //   @MessageBody() peerContact: string
  // ) {
  //   contact.broadcast.to(peerContact).emit(PeekAction.Ready)
  // }

  // @SubscribeMessage(PeekAction.Candidate)
  // candidate(
  //   @ConnectedSocket() contact: Socket,
  //   @MessageBody() peerContact: { room: string; cancidate: any }
  // ) {
  //   contact.broadcast
  //     .to(peerContact.room)
  //     .emit(PeekAction.Candidate, peerContact)
  // }

  // @SubscribeMessage(PeekAction.Offer)
  // offer(
  //   @ConnectedSocket() contact: Socket,
  //   @MessageBody() peerContact: { room: string; sdp: any }
  // ) {
  //   contact.broadcast
  //     .to(peerContact.room)
  //     .emit(PeekAction.Offer, peerContact.sdp)
  // }

  // @SubscribeMessage(PeekAction.Answer)
  // answer(
  //   @ConnectedSocket() contact: Socket,
  //   @MessageBody() peerContact: { room: string; sdp: any }
  // ) {
  //   contact.broadcast
  //     .to(peerContact.room)
  //     .emit(PeekAction.Answer, peerContact.sdp)
  // }
}
