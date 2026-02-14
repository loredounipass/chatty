import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export enum MessageType {
  TEXT = 'text',
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
}

export class CreateMessageDto {
  @IsOptional()
  @IsString()
  content?: string;

  @IsEnum(MessageType)
  type: MessageType;

  @IsString()
  @IsNotEmpty()
  receiverId: string;

  @IsOptional()
  @IsString()
  multimediaUrl?: string;

  // Optional: allow passing senderId when not using auth middleware
  @IsOptional()
  @IsString()
  senderId?: string;
}
