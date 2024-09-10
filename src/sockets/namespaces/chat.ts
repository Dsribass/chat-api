import { Namespace, Socket } from "socket.io";
import { SocketNamespace } from "../server";
import { AuthenticationHandler } from "../../common/authentication-handler";
import { ApplicationError } from "../../common/errors";

export class ChatNamespace extends SocketNamespace<ChatServer, ChatSocket> {
  constructor(authenticationHandler: AuthenticationHandler) {
    super("/chat", authenticationHandler);
  }

  private readonly onlineUsers: [id: string, socket: string][] = [];

  onConnection(socket: ChatSocket): void {
    console.log("Socket connection ${socket.id}");
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
  }
}

interface ServerToClientEvents {}

interface ClientToServerEvents {}

interface InterServerEvents {}

interface SocketData {
  userId: string;
}

export type ChatSocket = Socket<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>;

export type ChatServer = Namespace<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>;
