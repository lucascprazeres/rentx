import { resolve as resolvePath } from "path";
import { inject, injectable } from "tsyringe";
import { v4 as uuidV4 } from "uuid";

import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { IUserTokensRepository } from "@modules/accounts/repositories/IUserTokenRespository";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { IMailProvider } from "@shared/container/providers/MailProvider/IMailProvider";
import { AppError } from "@shared/errors/AppError";

@injectable()
class SendForgotPasswordMailUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,
    @inject("UserTokensRepository")
    private userTokensRepository: IUserTokensRepository,
    @inject("DateProvider")
    private dateProvider: IDateProvider,
    @inject("EtherealMailProvider")
    private mailProvider: IMailProvider
  ) {}

  async execute(email: string): Promise<void> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError("Invalid email.");
    }

    const token = uuidV4();
    const expires_in = this.dateProvider.getTimestampFromHourCount(3);
    await this.userTokensRepository.create({
      user_id: user.id,
      refresh_token: token,
      expires_in,
    });

    const templatePath = resolvePath(
      __dirname,
      "..",
      "..",
      "views",
      "email",
      "forgotPassword.hbs"
    );

    await this.mailProvider.sendMail({
      to: email,
      subject: "Recuperação de senha",
      path: templatePath,
      variables: {
        name: user.name,
        link: `${process.env.FORGOT_MAIL_URL}${token}`,
      },
    });
  }
}

export { SendForgotPasswordMailUseCase };
