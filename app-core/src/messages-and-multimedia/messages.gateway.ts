import { Logger } from '@nestjs/common';
import { SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessagesAndMultimediaService } from './messages-and-multimedia.service';
import { CreateMessageDto } from './dto/create-message.dto';

@WebSocketGateway({ namespace: '/messages', cors: { origin: '*' } })
export class MessagesGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private logger = new Logger('MessagesGateway');

  constructor(private readonly service: MessagesAndMultimediaService) {}

  async handleConnection(client: Socket) {
    const userId = (client.handshake.query.userId as string) || null;
    if (userId) {
      client.join(`user:${userId}`);
      this.logger.log(`Client connected and joined room user:${userId}`);
    } else {
      this.logger.log(`Client connected without userId: ${client.id}`);
    }
  }

  async handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(client: Socket, payload: CreateMessageDto) {
    // Prefer authenticated user in the handshake query
    const senderId = (client.handshake.query.userId as string) || payload.senderId;
    if (!senderId) {
      client.emit('error', { message: 'Missing senderId' });
      return;
    }

    // Persist message
    const message = await this.service.createMessage(payload, senderId);

    // Emit to receiver room and ack sender
    this.server.to(`user:${payload.receiverId}`).emit('receiveMessage', message);
    client.emit('messageSent', message);
  }
}
