import { FastifyReply, FastifyRequest } from "fastify";
import { IChannelService } from "../../services";

export class DeleteChannelController {
  constructor(private readonly channelService: IChannelService) {
    this.handler = this.handler.bind(this);
  }

  async handler(
    request: FastifyRequest<{ Body: DeleteChannelController.Body }>,
    reply: FastifyReply
  ) {
    const { id } = request.body;
    await this.channelService.deleteChannel({ channelId: id });
    reply.status(200).send();
  }
}

namespace DeleteChannelController {
  export interface Body {
    id: string;
  }
}
