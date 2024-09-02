import { FastifyReply, FastifyRequest } from "fastify";
import { IChannelService, IUserService } from "../../services";
import { Channel } from "diagnostics_channel";

export class GetChannelController {
  constructor(private readonly channelService: IChannelService) {
    this.handler = this.handler.bind(this);
  }

  async handler(
    request: FastifyRequest<{
      Body: GetChannelController.Body;
      Params: GetChannelController.Params;
    }>,
    reply: FastifyReply
  ) {
    const { id } = request.params;

    const channel = await this.channelService.getChannel({ channelId: id });

    reply.status(200).send(channel);
  }
}

namespace GetChannelController {
  export type Body = Channel;
    export interface Params {
        id: string;
    }
}
