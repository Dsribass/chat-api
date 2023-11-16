import { randomUUID } from "crypto";

class User {
  constructor(props: { id?: string; name: string; email: string }) {
    this.id = props.id ?? randomUUID();
    this.name = props.name;
    this.email = props.email;
  }

  public readonly id: string;
  public name: string;
  public email: string;
}

export { User };
