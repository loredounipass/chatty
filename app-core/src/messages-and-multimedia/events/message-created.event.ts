export interface MessageCreatedEvent {
  _id: string;
  content: string;
  type: string;
  sender: string;
  receiver: string;
  multimediaUrl?: string;
  status: 'sent' | 'delivered' | 'read';
  createdAt: Date;
  updatedAt: Date;
}
