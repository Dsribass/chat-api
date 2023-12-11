import { Message } from "../message";
import { User } from "../user";

export interface Channel {
  id: string;
  members: User[];
  messages: Message[];
}
