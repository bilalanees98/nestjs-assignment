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
    const usersToUpdate: { id: string; socketId: string }[] = this.users.filter(
      (user) => followerIds.includes(user.id),
    );
    if (usersToUpdate.length !== 0) {
      console.log(
        'from usersToupdate: ',
        usersToUpdate.map((user) => user.id),
      );
    }
    const post = event.post;
    console.log('users to update: ', usersToUpdate);
    if (usersToUpdate.length !== 0) {
      this.server
        .to(usersToUpdate.map((user) => user.socketId))
        .emit('post', post);
    }
  }
  handleConnection(client: any, ...args: any[]) {
    console.log('connected');
  }
  afterInit(server: any) {
    console.log('initialized');
  }
  async handleDisconnect(client: Socket) {
    const removed = this.users.splice(
      this.users.findIndex((user) => {
        return client.id === user.socketId;
      }),
      1,
    );
    console.log('disconnected user: ', removed);
  }

  @SubscribeMessage('userId')
  async onStart(client: Socket, id) {
    console.log('listened: ', id);
    this.users.push({ id: id, socketId: client.id });
  }
}
