import { PrismaClient } from "@prisma/client";
import { Channel, ChannelUser } from "../models/channel/channel";
import { DirectChannel } from "../models/channel/direct-channel";
import { GroupChannel } from "../models/channel/group-channel";
import { ApplicationError, ErrorType } from "../common";
import { Message } from "../models/message";
import { EventEmitter } from "stream";

export interface IChannelService {
  createDirectChannel: (
    params: IChannelService.CreateDirectChannelParams
  ) => Promise<IChannelService.CreateDirectChannelResult>;
  createGroupChannel: (
    params: IChannelService.CreateGroupChannelParams
  ) => Promise<IChannelService.CreateGroupChannelResult>;
  deleteChannel: (
    params: IChannelService.DeleteChannelParams
  ) => Promise<IChannelService.DeleteChannelResult>;
  updateChannel: (
    params: IChannelService.UpdateChannelParams
  ) => Promise<IChannelService.UpdateChannelResult>;
  getChannel: (
    params: IChannelService.GetChannelParams
  ) => Promise<IChannelService.GetChannelResult>;
  saveMessage: (
    params: IChannelService.SaveMessageParams
  ) => Promise<IChannelService.SaveMessageResult>;
  readMessage: (
    params: IChannelService.ReadMessageParams
  ) => Promise<IChannelService.ReadMessageResult>;
}

export class ChannelService implements IChannelService {
  constructor(private prismaClient: PrismaClient) {}

  async createDirectChannel(param: IChannelService.CreateDirectChannelParams) {
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
        type: ErrorType.ITEM_ALREADY_EXISTS,
        message: "Direct channel already exists",
        statusCode: 400,
      });
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
            data: this.mapMessageListToMessageModelList(channel.messages),
          },
        },
      },
    });
  }

  async createGroupChannel(param: IChannelService.CreateGroupChannelParams) {
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
            data: this.mapMessageListToMessageModelList(channel.messages),
          },
        },
      },
    });
  }

  async deleteChannel(param: IChannelService.DeleteChannelParams) {
    const { channelId } = param;

    await this.prismaClient.channel
      .delete({
        where: { id: channelId },
      })
      .catch((_) => {
        throw new ApplicationError({
          type: ErrorType.ITEM_NOT_FOUND,
          message: "Channel not exists",
          statusCode: 404,
        });
      });
  }

  async updateChannel(param: IChannelService.UpdateChannelParams) {
    const { id, name, members } = param;

    await this.prismaClient.channel.update({
      where: { id },
      data: {
        name,
        members: {
          set: members?.map((member) => ({ email: member })),
        },
      },
    });
  }

  async getChannel(param: IChannelService.GetChannelParams) {
    const { channelId } = param;

    const channel = await this.prismaClient.channel.findFirst({
      where: { id: channelId },
      include: {
        members: true,
        messages: true,
      },
    });

    if (!channel) {
      throw new ApplicationError({
        type: ErrorType.ITEM_NOT_FOUND,
        message: "Channel not exists",
        statusCode: 404,
      });
    }

    if (channel.type === "DIRECT") {
      return new DirectChannel({
        id: channel.id,
        members: channel.members.map((member) => ({
          id: member.id,
          name: member.name,
          email: member.email,
        })) as [ChannelUser, ChannelUser],
        messages: this.mapMessageModelListToMessageList(channel.messages),
      });
    } else {
      return new GroupChannel({
        id: channel.id,
        name: channel.name!,
        members: channel.members.map((member) => ({
          id: member.id,
          name: member.name ?? undefined,
          email: member.email,
        })),
        messages: this.mapMessageModelListToMessageList(channel.messages),
      });
    }
  }

  async saveMessage(param: IChannelService.SaveMessageParams) {
    const { message } = param;

    await this.prismaClient.message.create({
      data: {
        id: message.id,
        content: message.content,
        createdAt: new Date(message.timestamp),
        senderId: message.senderId,
        channelId: message.channelId,
        readBy: [],
      },
    });
  }

  async readMessage(param: IChannelService.ReadMessageParams) {
    const { userId, channelId } = param;

    await this.prismaClient.message.updateMany({
      where: {
        channelId,
        NOT: {
          readBy: {
            has: userId,
          },
        },
      },
      data: {
        readBy: {
          push: userId,
        },
      },
    });
  }

  private mapMessageListToMessageModelList(messages: Message[]) {
    return messages.map((message) => ({
      id: message.id,
      content: message.content,
      createdAt: new Date(message.timestamp),
      senderId: message.senderId,
      channelId: message.channelId,
    }));
  }

  private mapMessageModelListToMessageList(
    messages: {
      id: string;
      content: string;
      createdAt: Date;
      senderId: string;
      channelId: string;
      readBy: string[];
    }[]
  ): Message[] {
    return messages.map((message) => ({
      id: message.id,
      content: message.content,
      timestamp: message.createdAt.getTime(),
      senderId: message.senderId,
      channelId: message.channelId,
      readBy: message.readBy,
    }));
  }
}

namespace IChannelService {
  export type CreateDirectChannelParams = {
    channel: DirectChannel;
  };

  export type CreateDirectChannelResult = void;

  export type CreateGroupChannelParams = {
    channel: GroupChannel;
  };

  export type CreateGroupChannelResult = void;

  export type DeleteChannelParams = {
    channelId: string;
  };

  export type DeleteChannelResult = void;

  export type UpdateChannelParams = {
    id: string;
    name?: string;
    members?: string[];
  };

  export type UpdateChannelResult = void;

  export type GetChannelParams = {
    channelId: string;
  };

  export type GetChannelResult = Channel;

  export type SaveMessageParams = {
    message: Message;
  };

  export type SaveMessageResult = void;

  export type ReadMessageParams = {
    userId: string;
    channelId: string;
  };

  export type ReadMessageResult = void;
}
