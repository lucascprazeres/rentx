import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";

import { AppError } from "../errors/AppError";
import { UsersRepository } from "../modules/accounts/repositories/implementations/UsersRespository";

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
    const verifiedToken = verify(token, process.env.JWT_TOKEN_SECRET);

    const { sub: user_id } = verifiedToken as IPayload;

    const usersRepository = new UsersRepository();

    const user = await usersRepository.findById(user_id);

    if (!user) {
      throw new AppError("User does not exists.", 401);
    }

    next();
  } catch (error) {
    throw new AppError("Invalid token.", 401);
  }
}

export { ensureAuthenticated };
