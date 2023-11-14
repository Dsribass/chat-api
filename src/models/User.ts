import { randomUUID } from "crypto";

interface IUser {
  id?: string;
  name: string;
  email: string;
}

class User {
  constructor(props: IUser) {
    this.id = props.id ?? randomUUID();
    this.name = props.name;
    this.email = props.email;
  }

  public readonly id: string;
  public name: string;
  public email: string;
}

export { User };
