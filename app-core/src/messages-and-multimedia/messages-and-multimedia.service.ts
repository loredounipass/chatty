import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Message, MessageDocument } from './schemas/message.schema';
import { Multimedia, MultimediaDocument } from './schemas/multimedia.schema';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class MessagesAndMultimediaService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
    @InjectModel(Multimedia.name) private multimediaModel: Model<MultimediaDocument>,
  ) {}

  async createMessage(dto: CreateMessageDto, senderId: string) {
    const sender = new Types.ObjectId(senderId);
    const receiver = new Types.ObjectId(dto.receiverId);

    const created = await this.messageModel.create({
      content: dto.content,
      type: dto.type,
      sender,
      receiver,
      multimediaUrl: dto.multimediaUrl,
    });

    return this.messageModel
      .findById(created._id)
      .populate('sender')
      .populate('receiver')
      .exec();
  }

  async getMessagesByUser(userId: string) {
    const id = new Types.ObjectId(userId);
    return this.messageModel
      .find({ $or: [{ sender: id }, { receiver: id }] })
      .populate('sender')
      .populate('receiver')
      .sort({ createdAt: -1 })
      .exec();
  }

  async saveMultimedia(data: { url: string; type: string; ownerId: string; description?: string; messageId?: string }) {
    const owner = new Types.ObjectId(data.ownerId);
    const message = data.messageId ? new Types.ObjectId(data.messageId) : undefined;

    const created = await this.multimediaModel.create({
      url: data.url,
      type: data.type,
      owner,
      description: data.description,
      message,
    });

    return this.multimediaModel.findById(created._id).populate('owner').exec();
  }
}
