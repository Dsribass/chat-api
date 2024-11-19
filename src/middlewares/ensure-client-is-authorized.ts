import { FastifyReply, FastifyRequest, HookHandlerDoneFunction } from "fastify";
import { verify } from "jsonwebtoken";
import { ApplicationError, ErrorType } from "../common/errors";
import { AuthenticationHandler } from "../common";

function ensureClientIsAuthorized(props: {
  authenticationHandler: AuthenticationHandler;
  request: FastifyRequest;
  reply: FastifyReply;
  done: HookHandlerDoneFunction;
}) {
  const { authenticationHandler, request, done } = props;
  
  const bearerToken = request.headers.authorization;

  if (!bearerToken) {
    throw new ApplicationError({
      type: ErrorType.INVALID_TOKEN,
      message: "Token not provided",
      statusCode: 401,
    });
  }

  const [_, token] = bearerToken.split(" ");

  authenticationHandler.verifyToken(token);
  done();
}

export { ensureClientIsAuthorized };
