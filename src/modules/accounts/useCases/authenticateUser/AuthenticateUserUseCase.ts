import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { inject, injectable } from "tsyringe";

import { AppError } from "@errors/AppError";
import { IAuthenticateUserDTO } from "@modules/accounts/dtos/IAuthenticateUserDTO";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";

interface IResponse {
  user: {
    name: string;
    email: string;
  };
  token: string;
}

@injectable()
export class AuthenticateUserUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository
  ) {}

  async execute({ email, password }: IAuthenticateUserDTO): Promise<IResponse> {
    const foundUserByEmail = await this.usersRepository.findByEmail(email);

    if (!foundUserByEmail) {
      throw new AppError("Email or password incorrect for this user.");
    }

    const { id, password: storedPassword } = foundUserByEmail;

    const passwordsMatch = await compare(password, storedPassword);

    if (!passwordsMatch) {
      throw new AppError("Email or password incorrect for this user");
    }

    const token = sign({}, process.env.JWT_TOKEN_SECRET, {
      subject: id,
      expiresIn: process.env.JWT_TOKEN_EXPIRATION,
    });

    const user = {
      name: foundUserByEmail.name,
      email: foundUserByEmail.email,
    };

    return { user, token };
  }
}
