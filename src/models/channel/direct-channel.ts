import { randomUUID } from "crypto";
import { Message } from "../message";
import { Channel, ChannelUser } from "./channel";

export class DirectChannel implements Channel {
  constructor(props: {
    id?: string;
    members: [ChannelUser, ChannelUser];
    messages?: Message[];
  }) {
    this.id = props.id ?? randomUUID();
    this.members = props.members;
    this.messages = props.messages ?? [];
  }

  readonly id: string;
  readonly members: ChannelUser[];
  readonly messages: Message[];
}
