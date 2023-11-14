import { FastifyReply, FastifyRequest, HookHandlerDoneFunction } from "fastify";
import { ApplicationError } from "../common/errors";
import { verify } from "jsonwebtoken";
import { config } from "../common/config";

function ensureClientIsAuthorized(
  request: FastifyRequest,
  reply: FastifyReply,
  done: HookHandlerDoneFunction
) {
  const bearerToken = request.headers.authorization;

  if (!bearerToken) {
    throw new ApplicationError({
      message: "Token not provided",
      statusCode: 401,
    });
  }

  const [_, token] = bearerToken.split(" ");

  try {
    verify(token, config.access_token_secret);
    done();
  } catch (_) {
    throw new ApplicationError({
      message: "Invalid token",
      statusCode: 401,
    });
  }
}

export { ensureClientIsAuthorized };
