import { randomUUID } from "crypto";
import { Message } from "../message";
import { User } from "../user";
import { Channel } from "./channel";

export class PrivateChannel implements Channel {
    constructor(props: {
      id?: string;
      members: [User, User];
      messages?: Message[];
    }) {
      this.id = props.id ?? randomUUID();
      this.members = props.members;
      this.messages = props.messages ?? [];
    }
  
    readonly id: string;
    readonly members: User[];
    readonly messages: Message[];
  }