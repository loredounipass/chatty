import { Body, Controller, Get, Headers, Param, Post } from '@nestjs/common';
import { MessagesAndMultimediaService } from './messages-and-multimedia.service';
import { CreateMessageDto } from './dto/create-message.dto';

@Controller('messages')
export class MessagesAndMultimediaController {
  constructor(private readonly service: MessagesAndMultimediaService) {}

  @Post()
  async create(@Body() dto: CreateMessageDto, @Headers('x-user-id') headerUserId: string) {
    const senderId = dto.senderId || headerUserId;
    return this.service.createMessage(dto, senderId);
  }

  @Get('user/:id')
  async getByUser(@Param('id') id: string) {
    return this.service.getMessagesByUser(id);
  }
}
