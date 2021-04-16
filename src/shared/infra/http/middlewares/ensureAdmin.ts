import { NextFunction, Response, Request } from "express";

import { UsersRepository } from "@modules/accounts/infra/typeorm/repositories/UsersRespository";
import { AppError } from "@shared/errors/AppError";

export async function ensureAdmin(
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> {
  const { id } = request.user;

  const usersRepository = new UsersRepository();

  const { admin } = await usersRepository.findById(id);

  if (!admin) {
    throw new AppError("User is not an admin.", 401);
  }

  next();
}
