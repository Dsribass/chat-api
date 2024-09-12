import { ApplicationError } from "../../common/errors";
import { Message } from "../../models/message";
import { IChannelService } from "../../services";

export class SendMessageController {
  constructor(private readonly channelService: IChannelService) {
    this.handler = this.handler.bind(this);
  }

  async handler(
    data: SendMessageController.IncomingEventData,
    emitter: (data: SendMessageController.OutgoingEventData) => void
  ) {
    const channel = await this.channelService.getChannel({
      channelId: data.message.channelId,
    });

    if (!channel) {
      throw new ApplicationError({
        message: "Channel not found",
      });
    }

    const message = new Message({
      ...data.message,
    });

    await this.channelService.saveMessage({
      message: message,
    });

    emitter({
      message: message,
      recipients: channel.members.map((member) => member.id),
    });
  }
}

export namespace SendMessageController {
  export type IncomingEventData = {
    message: {
      channelId: string;
      senderId: string;
      content: string;
      timestamp: number;
    };
  };

  export type OutgoingEventData = {
    message: Message;
    recipients: string[];
  };
}
