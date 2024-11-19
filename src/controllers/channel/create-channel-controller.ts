import { FastifyReply, FastifyRequest } from "fastify";
import { ApplicationError, ErrorType } from "../../common";
import { DirectChannel } from "../../models/channel/direct-channel";
import { GroupChannel } from "../../models/channel/group-channel";
import { User } from "../../models/user";
import { IChannelService, IUserService } from "../../services";

export class CreateChannelController {
  constructor(
    private readonly channelService: IChannelService,
    private readonly userService: IUserService
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
          type: ErrorType.CHANNEL_MIN_MEMBERS,
          message: "Group channel must have at least 2 members",
          statusCode: 400,
        });
      }

      if (name === "" || name === null || name === undefined) {
        throw new ApplicationError({
          type: ErrorType.CHANNEL_NAME_REQUIRED,
          message: "Group channel must have a name",
          statusCode: 400,
        });
      }

      const groupChannel = new GroupChannel({
        name,
        members: await Promise.all(
          members.map((email) => this.userService.getUserByEmail({ email }))
        ),
      });

      await this.channelService.createGroupChannel({ channel: groupChannel });

      return groupChannel.id;
    } else {
      if (members.length !== 2) {
        throw new ApplicationError({
          type: ErrorType.CHANNEL_MIN_MEMBERS,
          message: "Direct channel must have exactly 2 members",
          statusCode: 400,
        });
      }

      const directChannel = new DirectChannel({
        members: (await Promise.all(
          members.map((email) => this.userService.getUserByEmail({ email }))
        )) as [User, User],
      });

      await this.channelService.createDirectChannel({ channel: directChannel });

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
