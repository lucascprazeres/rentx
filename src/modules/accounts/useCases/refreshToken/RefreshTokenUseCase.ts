import { sign, verify } from "jsonwebtoken";
import { inject, injectable } from "tsyringe";

import auth from "@config/auth";
import { IUserTokensRepository } from "@modules/accounts/repositories/IUserTokenRespository";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { AppError } from "@shared/errors/AppError";

interface IPayload {
  sub: string;
  email: string;
}

interface ITokenResponse {
  token: string;
  refresh_token: string;
}

@injectable()
class RefreshTokenUseCase {
  constructor(
    @inject("UserTokensRepository")
    private userTokensRepository: IUserTokensRepository,
    @inject("DateProvider")
    private dateProvider: IDateProvider
  ) {}

  async execute(refresh_token: string): Promise<ITokenResponse> {
    const { sub, email } = verify(
      refresh_token,
      auth.refreshToken.secret
    ) as IPayload;

    const user_id = sub;

    const user_token = await this.userTokensRepository.findByUserIdAndToken({
      user_id,
      refresh_token,
    });

    if (!user_token) {
      throw new AppError("Invalid refresh token.");
    }

    await this.userTokensRepository.deleteById(user_token.id);

    const new_refresh_token = sign({ email }, auth.refreshToken.secret, {
      subject: sub,
      expiresIn: auth.refreshToken.expiresIn,
    });

    const expires_in = this.dateProvider.getTimestampFromDayCount(
      auth.refreshToken.expirationInDays
    );

    await this.userTokensRepository.create({
      user_id,
      refresh_token: new_refresh_token,
      expires_in,
    });

    const new_token = sign({}, auth.jwt.secret, {
      subject: user_id,
      expiresIn: auth.jwt.expiresIn,
    });

    return {
      token: new_token,
      refresh_token: new_refresh_token,
    };
  }
}

export { RefreshTokenUseCase };
