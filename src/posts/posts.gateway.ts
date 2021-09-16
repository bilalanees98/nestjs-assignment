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
import { Post } from '@nestjs/common';

@WebSocketGateway()
export class PostsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  users: { id: string; socketId: string }[] = [];
  @WebSocketServer() server: Server;

  @OnEvent('post')
  handlePostCreatedEvent(event: any) {
    const following = event.user.following;
    const followers = following;
    // const followers: any = event.users.followers;
    const socketsToUpdate: string[] = [];
    this.users.forEach((user) => {
      if (followers.includes(user.id)) {
        socketsToUpdate.push(user.socketId);
      }
    });
    const post = event.post;
    console.log(event);
    console.log('followers to update: ', socketsToUpdate);
    this.server.to(socketsToUpdate).emit('post', post);
    // if (socketsToUpdate.length !== 0) {
    //   this.server.to(socketsToUpdate).emit('post', post);
    // }
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
    // client.broadcast.emit('post', message);
  }
}
