import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type MultimediaDocument = Multimedia & Document;

@Schema({ timestamps: true })
export class Multimedia {
  @Prop({ required: true })
  url: string;

  @Prop({ enum: ['image', 'video', 'audio'], required: true })
  type: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  owner: Types.ObjectId;

  @Prop()
  description?: string;

  @Prop({ type: Types.ObjectId, ref: 'Message' })
  message?: Types.ObjectId;
}

export const MultimediaSchema = SchemaFactory.createForClass(Multimedia);
