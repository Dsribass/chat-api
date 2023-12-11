import { randomUUID } from "crypto";
import { Channel } from "./channel/channel";

class User {
  constructor(props: {
    id?: string;
    name: string;
    email: string;
    channel?: Channel[];
  }) {
    this.id = props.id ?? randomUUID();
    this.name = props.name;
    this.email = props.email;
    this.channels = props.channel ?? [];
  }

  public readonly id: string;
  public readonly name: string;
  public readonly email: string;
  public readonly channels: Channel[];
}

export { User };
