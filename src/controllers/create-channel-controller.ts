import { FastifyReply, FastifyRequest } from "fastify";
import { ApplicationError } from "../common";
import { GroupChannel } from "../models/channel/group-channel";
import { DirectChannel } from "../models/channel/direct-channel";
import { User } from "../models/user";
import { CreateDirectChannel } from "../services/create-direct-channel";
import { CreateGroupChannel } from "../services/create-group-channel";
import { GetUser } from "../services";

export class CreateChannelController {
  constructor(
    private readonly getUser: GetUser,
    private readonly createDirectChannel: CreateDirectChannel,
    private readonly createGroupChannel: CreateGroupChannel
  ) {
    this.handler = this.handler.bind(this);
  }

  async handler(
    request: FastifyRequest<{ Body: CreateChannelController.Body }>,
    reply: FastifyReply
  ) {
    const channelId = await this.createChannel(request.body);

    reply.status(201).send({
      channelId: channelId,
    });
  }

  private async createChannel(body: CreateChannelController.Body) {
    const { type, name, members } = body;
    if (type === "group") {
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
          members.map((email) =>
            this.getUser.execute({
              by: "email",
              email,
            })
          )
        ),
      });

      console.log(groupChannel);

      await this.createGroupChannel.execute({ channel: groupChannel });

      return groupChannel.id;
    } else {
      if (members.length !== 2) {
        throw new ApplicationError({
          message: "Direct channel must have exactly 2 members",
          statusCode: 400,
        });
      }

      const directChannel = new DirectChannel({
        members: (await Promise.all(
          members.map((email) =>
            this.getUser.execute({
              by: "email",
              email,
            })
          )
        )) as [User, User],
      });

      console.log(directChannel);

      await this.createDirectChannel.execute({ channel: directChannel });

      return directChannel.id;
    }
  }
}

namespace CreateChannelController {
  export interface Body {
    type: "group" | "direct";
    name?: string;
    members: string[];
  }
}
