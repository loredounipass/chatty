import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type MessageDocument = Message & Document;

@Schema({ timestamps: true })
export class Message {
  @Prop()
  content: string;

  @Prop({ enum: ['text', 'image', 'video', 'audio'], default: 'text' })
  type: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  sender: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  receiver: Types.ObjectId;

  @Prop()
  multimediaUrl?: string;

  _id?: string;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
