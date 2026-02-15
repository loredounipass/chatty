import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { MessagesAndMultimediaService } from './messages-and-multimedia.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { AuthenticatedGuard } from 'src/guard/auth/authenticated.guard';
import { CurrentUser } from 'src/guard/auth/current-user.decorator';

@Controller('messages')
export class MessagesAndMultimediaController {
  constructor(private readonly service: MessagesAndMultimediaService) {}


  @UseGuards(AuthenticatedGuard)
  @Post()
  async create(@Body() dto: CreateMessageDto, @CurrentUser() user: any) {
    return this.service.createMessage(dto, user._id.toString());
  }

  @UseGuards(AuthenticatedGuard)
  @Get('me')
  async getMyMessages(@CurrentUser() user: any) {
    return this.service.getMessagesByUser(user._id.toString());
  }
}