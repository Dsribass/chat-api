import { ApplicationError, ErrorType } from "../../common/errors";
import { Message } from "../../models/message";
import { IChannelService } from "../../services";

export class ReadMessageController {
  constructor(private readonly channelService: IChannelService) {
    this.handler = this.handler.bind(this);
  }

  async handler(
    data: ReadMessageController.IncomingEventData,
    emitter: (data: ReadMessageController.OutgoingEventData) => void
  ) {
    const { userId, channelId } = data;

    const channel = await this.channelService.getChannel({ channelId });

    if (!channel) {
      throw new ApplicationError({
        type: ErrorType.ITEM_NOT_FOUND,
        message: "Channel not found",
        statusCode: 404,
      });
    }

    await this.channelService.readMessage({ userId, channelId });

    emitter({
      channelId: channel.id,
      readBy: userId,
      recipients: channel.members.map((member) => member.id),
    });
  }
}

export namespace ReadMessageController {
  export type IncomingEventData = {
    userId: string;
    channelId: string;
  };

  export type OutgoingEventData = {
    channelId: string;
    readBy: string;
    recipients: string[];
  };
}
