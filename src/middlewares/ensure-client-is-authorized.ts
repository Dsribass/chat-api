import { FastifyReply, FastifyRequest, HookHandlerDoneFunction } from "fastify";
import { verify } from "jsonwebtoken";
import env from "../common/env";
import { ApplicationError } from "../common/errors";

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
    verify(token, env.access_token_secret);
    done();
  } catch (_) {
    throw new ApplicationError({
      message: "Invalid token",
      statusCode: 401,
    });
  }
}

export { ensureClientIsAuthorized };
