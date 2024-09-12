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
      const bearerToken =
        socket.handshake.auth.token ?? socket.request.headers.authorization;

      if (!bearerToken) {
        next(
          new ApplicationError({
            message: "Token not provided",
            statusCode: 401,
          })
        );
      }

      const [_, token] = bearerToken.split(" ");

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

type SocketCallback = (response: {
  status: "success" | "error";
  message?: string;
}) => void;

export { SocketNamespace, SocketServer, SocketCallback };
