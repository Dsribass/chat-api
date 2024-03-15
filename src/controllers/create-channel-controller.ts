import { FastifyReply, FastifyRequest } from "fastify";
import { ApplicationError } from "../common";
import { GetUserByEmail } from "../services";
import { GroupChannel } from "../models/channel/group-channel";
import { PrivateChannel } from "../models/channel/private-channel";
import { User } from "../models/user";

export class CreateChannelController {
  constructor(private readonly getUser: GetUserByEmail) {
    this.handler = this.handler.bind(this);
  }

  async handler(
    request: FastifyRequest<{ Body: CreateChannelController.Body }>,
    reply: FastifyReply
  ) {
    const { type } = request.body;

    if (type === "group") {
      this.createGroupChannel(request.body);
    } else {
      this.createPrivateChannel(request.body);
    }

    reply.status(201).send();
  }

  private async createGroupChannel(channel: CreateChannelController.Body) {
    const { name, members } = channel;

    if (members.length < 2) {
      throw new ApplicationError({
        message: "Group channel must have at least 2 members",
        statusCode: 400,
      });
    }

    if (name === "" || name === null || name === undefined) {
      throw new ApplicationError({
        message: "Group channel must have a name",
        statusCode: 400,
      });
    }

    const groupChannel = new GroupChannel({
      name,
      members: await Promise.all(
        members.map((email) => this.getUser.execute({ email }))
      ),
    });

    // TODO: Save group channel to database
  }

  private async createPrivateChannel(channel: CreateChannelController.Body) {
    const { members } = channel;

    if (members.length !== 2) {
      throw new ApplicationError({
        message: "Private channel must have exactly 2 members",
        statusCode: 400,
      });
    }

    const privateChannel = new PrivateChannel({
      members: (await Promise.all(
        members.map((email) => this.getUser.execute({ email }))
      )) as [User, User],
    });

    // TODO: Save private channel to database
  }
}

namespace CreateChannelController {
  export interface Body {
    type: "group" | "private";
    name?: string;
    members: string[];
  }
}
