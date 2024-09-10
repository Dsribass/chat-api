import { FastifyInstance } from "fastify";
import { Namespace, Server, Socket } from "socket.io";
import { ApplicationError, AuthenticationHandler } from "../common";

abstract class SocketNamespace<N extends Namespace, S extends Socket> {
  constructor(
    private readonly namespace: string,
    private readonly authenticationHandler: AuthenticationHandler
  ) {}

  protected io!: N;

  register(socketIO: Server): void {
    this.io = socketIO.of(this.namespace) as N;
    this.registerJWTValidation();
    this.io.on("connection", (socket) => this.onConnection(socket as S));
  }


  private registerJWTValidation(): void {
    this.io.use((socket, next) => {
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

  protected abstract onConnection(socket: S): void;
}

class SocketServer {
  constructor(
    private readonly namespaces: SocketNamespace<Namespace, Socket>[]
  ) {}

  setup(socketIO: Server): void {
    this.namespaces.forEach((namespace) => namespace.register(socketIO));
  }
}

export { SocketNamespace, SocketServer };
