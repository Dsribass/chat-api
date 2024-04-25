import { PrismaClient } from "@prisma/client";
import { Service } from "./service";
import { GroupChannel } from "../models/channel/group-channel";

export class CreateGroupChannel
  implements Service<CreateGroupChannel.Params, CreateGroupChannel.Result>
{
  constructor(private prismaClient: PrismaClient) {}

  async execute(param: CreateGroupChannel.Params) {
    const { channel } = param;

    await this.prismaClient.channel.create({
      data: {
        type: "GROUP",
        id: channel.id,
        name: channel.name,
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

export namespace CreateGroupChannel {
  export type Params = { channel: GroupChannel };

  export type Result = void;
}
