import { PrismaClient } from "@prisma/client";
import { ApplicationError } from "../common/errors";
import { DirectChannel } from "../models/channel/direct-channel";
import { GroupChannel } from "../models/channel/group-channel";
import { Message } from "../models/message";
import { User } from "../models/user";
import { Service } from "./service";

export class GetUser implements Service<GetUser.Params, GetUser.Result> {
  constructor(private prismaClient: PrismaClient) {}

  async execute(param: GetUser.Params) {
    if (param.by === "email") {
      return this.getUserByEmail(param);
    } else {
      return this.getUserById(param);
    }
  }

  private async getUserByEmail(param: GetUser.Params) {
    const user = await this.prismaClient.user.findFirst({
      where: { email: param.email },
    });

    if (!user) {
      throw new ApplicationError({
        message: "User not found",
        statusCode: 404,
      });
    }

    return new User({
      id: user.id,
      name: user.name,
      email: user.email,
      channels: await this.getUserChannels(user.id),
    });
  }

  private async getUserById(param: GetUser.Params) {
    const user = await this.prismaClient.user.findFirst({
      where: { id: param.id },
    });

    if (!user) {
      throw new ApplicationError({
        message: "User not found",
        statusCode: 404,
      });
    }

    return new User({
      id: user.id,
      name: user.name,
      email: user.email,
      channels: await this.getUserChannels(user.id),
    });
  }

  private async getUserChannels(id: string) {
    const channels = await this.prismaClient.channel.findMany({
      where: { members: { some: { id: id } } },
      include: {
        members: true,
        messages: true,
      },
    });

    return channels.map((channel) => {
      switch (channel.type) {
        case "DIRECT":
          return new DirectChannel({
            id: channel.id,
            members: channel.members.map(
              (member) =>
                new User({
                  id: member.id,
                  name: member.name,
                  email: member.email,
                })
            ) as [User, User],
            messages: channel.messages.map(
              (message) =>
                new Message({
                  id: message.id,
                  channelId: message.channelId,
                  content: message.content,
                  senderId: message.senderId,
                })
            ),
          });
        case "GROUP":
          return new GroupChannel({
            id: channel.id,
            name: channel.name!,
            members: channel.members.map(
              (member) =>
                new User({
                  id: member.id,
                  name: member.name,
                  email: member.email,
                })
            ),
            messages: channel.messages.map(
              (message) =>
                new Message({
                  id: message.id,
                  channelId: message.channelId,
                  content: message.content,
                  senderId: message.senderId,
                })
            ),
          });
      }
    });
  }
}

export namespace GetUser {
  export type Params = {
    by: "id" | "email";
    id?: string;
    email?: string;
  };

  export type Result = User;
}
