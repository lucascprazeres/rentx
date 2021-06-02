import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";

import auth from "@config/auth";
import { UserTokensRepository } from "@modules/accounts/infra/typeorm/repositories/UserTokensRepository";
import { AppError } from "@shared/errors/AppError";

interface IPayload {
  sub: string;
}

async function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new AppError("Missing authentication token", 401);
  }

  const [, token] = authHeader.split(" ");

  try {
    const verifiedToken = verify(token, auth.jwt.secret);

    const { sub: user_id } = verifiedToken as IPayload;

    request.user = { id: user_id };

    next();
  } catch (error) {
    throw new AppError("Invalid token.", 401);
  }
}

export { ensureAuthenticated };
