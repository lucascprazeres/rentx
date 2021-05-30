import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { inject, injectable } from "tsyringe";

import authConfig from "@config/auth";
import { IAuthenticateUserDTO } from "@modules/accounts/dtos/IAuthenticateUserDTO";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { IUserTokensRepository } from "@modules/accounts/repositories/IUserTokenRespository";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { AppError } from "@shared/errors/AppError";

interface IResponse {
  user: {
    name: string;
    email: string;
  };
  token: string;
  refresh_token: string;
}

@injectable()
export class AuthenticateUserUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,
    @inject("UserTokensRepository")
    private userTokensRepository: IUserTokensRepository,
    @inject("DateProvider")
    private dateProvider: IDateProvider
  ) {}

  async execute({ email, password }: IAuthenticateUserDTO): Promise<IResponse> {
    const foundUserByEmail = await this.usersRepository.findByEmail(email);

    if (!foundUserByEmail) {
      throw new AppError("Email or password incorrect for this user.");
    }

    const { id: user_id, password: storedPassword } = foundUserByEmail;

    const passwordsMatch = await compare(password, storedPassword);

    if (!passwordsMatch) {
      throw new AppError("Email or password incorrect for this user");
    }

    const token = sign({}, authConfig.jwt.secret, {
      subject: user_id,
      expiresIn: authConfig.jwt.expiresIn,
    });

    const refresh_token = sign({ email }, authConfig.refreshToken.secret, {
      subject: user_id,
      expiresIn: authConfig.refreshToken.expiresIn,
    });

    await this.userTokensRepository.create({
      user_id,
      refresh_token,
      expires_in: this.dateProvider.getTimestampFromDayCount(
        authConfig.refreshToken.expirationInDays
      ),
    });

    const user = {
      name: foundUserByEmail.name,
      email: foundUserByEmail.email,
    };

    return { user, token, refresh_token };
  }
}
