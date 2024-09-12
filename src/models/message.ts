import { randomUUID } from "crypto";

export class Message {
  constructor(props: {
    id?: string;
    channelId: string;
    content: string;
    senderId: string;
    timestamp?: number;
    readBy?: string[];
  }) {
    this.id = props.id ?? randomUUID();
    this.content = props.content;
    this.channelId = props.channelId;
    this.senderId = props.senderId;
    this.timestamp = props.timestamp ?? Date.now();
    this.readBy = props.readBy ?? [];
  }

  readonly id: string;
  readonly channelId: string;
  readonly senderId: string;
  readonly content: string;
  readonly timestamp: number;
  readonly readBy: string[];
}
