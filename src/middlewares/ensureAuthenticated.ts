import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";

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
    throw new Error("Missing authentication token");
  }

  const [, token] = authHeader.split(" ");

  try {
    const verifiedToken = verify(token, process.env.JWT_TOKEN_SECRET);

    const { sub: user_id } = verifiedToken as IPayload;

    const usersRepository = new UsersRepository();

    const user = await usersRepository.findById(user_id);

    if (!user) {
      throw new Error("User does not exists.");
    }

    next();
  } catch (error) {
    throw new Error("Invalid token.");
  }
}

export { ensureAuthenticated };
