import { FastifyReply, FastifyRequest } from "fastify";
import { IChannelService } from "../../services";
import { ApplicationError } from "../../common";

export class UpdateChannelController {
  constructor(private readonly channelService: IChannelService) {
    this.handler = this.handler.bind(this);
  }

  async handler(
    request: FastifyRequest<{ Body: UpdateChannelController.Body }>,
    reply: FastifyReply
  ) {
    const { id, name, members } = request.body;

    if (name === undefined && members === undefined) {
      throw new ApplicationError({
        message: "Name or members must be provided",
      });
    }

    await this.channelService.updateChannel({ id, name, members });

    reply.status(200).send();
  }
}

namespace UpdateChannelController {
  export interface Body {
    id: string;
    name?: string;
    members?: string[];
  }
}
