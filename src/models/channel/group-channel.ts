import { randomUUID } from "crypto";
import { Message } from "../message";
import { Channel, ChannelUser } from "./channel";

export class GroupChannel implements Channel {
  constructor(props: {
    id?: string;
    name: string;
    members: ChannelUser[];
    messages?: Message[];
  }) {
    this.id = props.id ?? randomUUID();
    this.name = props.name;
    this.members = props.members;
    this.messages = props.messages ?? [];
  }

  readonly id: string;
  readonly name: string;
  readonly members: ChannelUser[];
  readonly messages: Message[];
}
