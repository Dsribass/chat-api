import { randomUUID } from "crypto";
import { Message } from "../message";
import { Channel } from "./channel";
import { User } from "../user";

export class GroupChannel implements Channel {
  constructor(props: {
    id?: string;
    name: string;
    members: User[];
    messages?: Message[];
  }) {
    this.id = props.id ?? randomUUID();
    this.name = props.name;
    this.members = props.members;
    this.messages = props.messages ?? [];
  }

  readonly id: string;
  readonly name: string;
  readonly members: User[];
  readonly messages: Message[];
}
