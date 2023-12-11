import { randomUUID } from "crypto";

export class Message {
  constructor(props: {
    id?: string;
    channelId: string;
    content: string;
    senderId: string;
    receiverId: string;
    timestamp?: number;
  }) {
    this.id = props.id ?? randomUUID();
    this.content = props.content;
    this.channelId = props.channelId;
    this.senderId = props.senderId;
    this.receiverId = props.receiverId;
    this.timestamp = props.timestamp ?? Date.now();
  }

  readonly id: string;
  readonly channelId: string;
  readonly senderId: string;
  readonly receiverId: string;
  readonly content: string;
  readonly timestamp: number;
}
