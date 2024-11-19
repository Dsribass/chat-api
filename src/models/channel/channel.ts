import { Message } from "../message";
import { User } from "../user";

export interface Channel {
  id: string;
  members: ChannelUser[];
  messages: Message[];
}

export type ChannelUser = {
  id: string;
  name?: string;
  email: string;
}