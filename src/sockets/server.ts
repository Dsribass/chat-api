import { FastifyInstance } from "fastify";
import { Namespace, Server, Socket } from "socket.io";
import { ApplicationError, AuthenticationHandler } from "../common";

abstract class SocketNamespace<N extends Namespace, S extends Socket> {
  constructor(readonly namespace: string) {}

  protected io!: N;

  register(socketIO: Server): void {
    this.io = socketIO.of(this.namespace) as N;
    this.io.on("connection", (socket) => this.onConnection(socket as S));
  }

  abstract onConnection(socket: S): void;
}

class SocketServer {
  constructor(options: {
    socketIO: Server;
    authenticationHandler: AuthenticationHandler;
    namespaces: SocketNamespace<Namespace, Socket>[];
  }) {
    this.socketIO = options.socketIO;
    this.authenticationHandler = options.authenticationHandler;
    this.namespaces = options.namespaces;
  }

  private readonly socketIO: Server;
  private readonly authenticationHandler: AuthenticationHandler;
  private readonly namespaces: SocketNamespace<Namespace, Socket>[];

  setup(): void {
    this.registerJWTValidation();
    this.namespaces.forEach((namespace) => namespace.register(this.socketIO));
  }

  private registerJWTValidation() {
    this.socketIO.use((socket, next) => {
      const token = socket.handshake.auth.token;

      if (!token) {
        next(
          new ApplicationError({
            message: "Token not provided",
            statusCode: 401,
          })
        );
      }

      try {
        this.authenticationHandler.verifyToken(token);
        next();
      } catch (error) {
        if (error instanceof ApplicationError) {
          next(error);
        }
      }
    });
  }
}

export { SocketNamespace, SocketServer };
