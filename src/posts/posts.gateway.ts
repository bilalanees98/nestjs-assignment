import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayDisconnect,
  OnGatewayConnection,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { OnEvent } from '@nestjs/event-emitter';
import { Socket } from 'socket.io-client';

@WebSocketGateway()
export class PostsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  users: { id: string; socketId: string }[] = [];
  @WebSocketServer() server: Server;

  @OnEvent('post')
  async handlePostCreatedEvent(event: { post: any; user: any }) {
    const followerIds: string[] = event.user.followers;

    const socketsToUpdate: string[] = [];
    const followersToUpdate: string[] = [];

    if (followerIds) {
      this.users.forEach((connectedUser) => {
        if (followerIds.includes(connectedUser.id)) {
          socketsToUpdate.push(connectedUser.socketId);
          followersToUpdate.push(connectedUser.id);
        }
      });
    }
    const post = event.post;
    console.log('sockets to update: ', socketsToUpdate);
    console.log('followers to update: ', followersToUpdate);
    if (socketsToUpdate.length !== 0) {
      this.server.to(socketsToUpdate).emit('post', post);
    }
  }
  handleConnection(client: any, ...args: any[]) {
    console.log('connected');
  }
  afterInit(server: any) {
    console.log('initialized');
  }
  async handleDisconnect() {
    console.log('disconnected');
  }

  @SubscribeMessage('userId')
  async onStart(client: Socket, id) {
    console.log('listened: ', id);
    this.users.push({ id: id, socketId: client.id });
  }
}
