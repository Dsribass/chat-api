<p align="left">
  <p align="left">
    <img src="https://raw.githubusercontent.com/PKief/vscode-material-icon-theme/ec559a9f6bfd399b82bb44393651661b08aaf7ba/icons/folder-markdown-open.svg" width="20%" alt="CHAT-API-logo">
  </p>
  <h1 align="left">Chat API</h1>


This API offers secure user authentication and a real-time chat system. It allows users to register, log in, and exchange messages in real-time. Only authenticated users can access the chat, ensuring privacy and security in both private and group conversations. The system is designed for seamless, fast communication, providing a reliable platform for user interactions.

## ✨ Features

  - **Secure User Authentication:** Enables users to register and log in, ensuring that only authenticated individuals can access the chat system.
  - **Real-time Messaging:** Instant message delivery, allowing users to send and receive messages in real-time.
  - **Private and Group Conversations:** Supports both private messaging and group chats, providing flexibility for user interactions.
  - **User Connection Management:** Tracks online users and manages their connections, ensuring an accurate list of active participants.
  - **Read Receipts:** Provides feedback to users when their messages have been read, enhancing communication transparency.



## ⚙️ Architecture

The architecture is organized with a clear directory structure to enhance modularity, readability, and maintainability. The api are built with [TypeScript](https://www.typescriptlang.org/), [Fastify](https://www.fastify.io/), [Prisma](https://www.prisma.io/), and [Socket.io](https://socket.io/), ensuring type safety, performance, and real-time communication. Here’s the project structure:

```sh
└── chat-api/
    ├── package-lock.json
    ├── package.json
    ├── prisma
    │   ├── migrations
    │   └── schema.prisma
    └── src
        ├── common
        ├── controllers
        ├── middlewares
        ├── models
        ├── schemas
        ├── sockets
        ├── services
        ├── api.http
        ├── factory.ts
        ├── routes.ts
        └── server.ts
```

### Socket Structure

This socket architecture is designed to provide a secure, modular, and scalable foundation for real-time communication in a Node.js application. The core structure uses Socket.IO namespaces for distinct functionalities and JWT-based authentication to control access.

#### Socket Namespace Abstraction (`SocketNamespace`)

`SocketNamespace` is an abstract class that represents a reusable template for creating different WebSocket namespaces within the application. Each namespace has its own set of events and handlers, enabling the app to handle various real-time features (like chat, notifications, etc.) in isolation.

#### JWT Authentication Middleware

The `SocketNamespace` includes a `registerJWTValidation` method, which enforces authentication at the connection level. This middleware checks for the presence of a JWT token, verifies its validity, and blocks unauthorized users from connecting. If the token is missing or invalid, an `ApplicationError` with a 401 status code is passed, stopping the connection. This layer of validation enhances security and prevents unauthorized access.

#### Namespace-Specific Connection Management (`onConnection` method)

Each `SocketNamespace` must define an `onConnection` method that handles user-specific events once they are successfully connected to the namespace. This method allows each namespace to define its unique event handling logic and response flow for incoming and outgoing messages, creating a custom real-time experience for each use case.

#### Socket Server Setup (`SocketServer`)

The `SocketServer` class coordinates and initializes multiple namespaces in a centralized manner. Its `setup` method takes a Socket.IO server instance and iterates over each registered namespace, invoking the `register` method on each. This setup ensures that the entire socket server is configured with all necessary namespaces, making it easier to manage and add more namespaces as the application scales.
