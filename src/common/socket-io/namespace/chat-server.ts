import { Namespace } from "socket.io";

interface ServerToClientEvents {}

interface ClientToServerEvents {}

interface InterServerEvents {}

interface SocketData {}

export type ChatServer = Namespace<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>;
