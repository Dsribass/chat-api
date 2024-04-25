import { PrismaClient } from "@prisma/client";
import { Service } from "./service";
import { DirectChannel } from "../models/channel/direct-channel";
import { ApplicationError } from "../common";

export class CreateDirectChannel
  implements Service<CreateDirectChannel.Params, CreateDirectChannel.Result>
{
  constructor(private prismaClient: PrismaClient) {}

  async execute(param: CreateDirectChannel.Params) {
    const { channel } = param;

    const hasDirectChannelCreated = await this.prismaClient.channel.findFirst({
      where: {
        type: "DIRECT",
        members: {
          every: {
            id: {
              in: channel.members.map((member) => member.id),
            },
          },
        },
      },
    });

    if (hasDirectChannelCreated) {
      throw new ApplicationError({
        message: "Direct channel already exists",
        statusCode: 400,
      })
    }

    await this.prismaClient.channel.create({
      data: {
        type: "DIRECT",
        id: channel.id,
        members: {
          connect: channel.members.map((member) => ({ id: member.id })),
        },
        messages: {
          createMany: {
            data: channel.messages.map((message) => ({
              id: message.id,
              content: message.content,
              createdAt: new Date(message.timestamp),
              senderId: message.senderId,
              channelId: message.channelId,
            })),
          },
        },
      },
    });
  }
}

export namespace CreateDirectChannel {
  export type Params = { channel: DirectChannel };

  export type Result = void;
}
