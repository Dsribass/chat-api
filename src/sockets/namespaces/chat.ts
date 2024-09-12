import { Namespace, Socket } from "socket.io";
import { AuthenticationHandler } from "../../common/authentication-handler";
import { SendMessageController } from "../../controllers/message/send-message-controller";
import {
  makeReadMessageController,
  makeSendMessageController,
} from "../../factory";
import { SocketCallback, SocketNamespace } from "../server";
import { ReadMessageController } from "../../controllers";

interface ServerToClientEvents {
  receivedMessage: (data: SendMessageController.OutgoingEventData) => void;
  readMessage: (data: ReadMessageController.OutgoingEventData) => void;
}

interface ClientToServerEvents {
  sendMessage: (
    data: SendMessageController.IncomingEventData,
    callback: SocketCallback
  ) => void;
  readMessage: (data: ReadMessageController.IncomingEventData) => void;
}

interface InterServerEvents {}

interface SocketData {
  userId: string;
}

export class ChatNamespace extends SocketNamespace<ChatServer, ChatSocket> {
  constructor(authenticationHandler: AuthenticationHandler) {
    super("/chat", authenticationHandler);
  }

  private readonly onlineUsers: [id: string, socket: string][] = [];

  onConnection(socket: ChatSocket): void {
    const userId = socket.data.userId;
    const hasUser = this.onlineUsers.some(([id]) => id === userId);
    if (!hasUser) {
      this.onlineUsers.push([userId, socket.id]);
    }

    socket.on("disconnect", () => {
      const index = this.onlineUsers.findIndex(([id]) => id === userId);
      if (index !== -1) {
        this.onlineUsers.splice(index, 1);
      }
    });

    socket.on("readMessage", async (incomingData) => {
      const readMessageController = makeReadMessageController();

      await readMessageController.handler(incomingData, (outgoingData) => {
        this.onlineUsers
          .filter(([id]) => outgoingData.recipients.includes(id))
          .forEach(([_, socketId]) => {
            this.io.to(socketId).emit("readMessage", outgoingData);
          });
      });
    });

    socket.on("sendMessage", async (incomingData, callback) => {
      const sendMessageController = makeSendMessageController();

      try {
        await sendMessageController.handler(incomingData, (outgoingData) => {
          this.onlineUsers
            .filter(([id]) => outgoingData.recipients.includes(id))
            .forEach(([_, socketId]) => {
              this.io.to(socketId).emit("receivedMessage", outgoingData);
            });

          callback({ status: "success" });
        });
      } catch (error: any) {
        callback({
          status: "error",
          message: error.message || "An error occurred",
        });
      }
    });
  }
}

type ChatSocket = Socket<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>;

type ChatServer = Namespace<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>;
