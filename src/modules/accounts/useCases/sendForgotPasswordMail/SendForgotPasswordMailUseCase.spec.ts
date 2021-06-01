import { UsersRepositoryMock } from "@modules/accounts/repositories/mocks/UsersRepositoryMock";
import { UserTokensRepositoryMock } from "@modules/accounts/repositories/mocks/UserTokensRepositoryMock";
import { DayjsDateProvider } from "@shared/container/providers/DateProvider/implementations/DayjsDateProvider";
import { MailProviderMock } from "@shared/container/providers/MailProvider/mock/MailProviderMock";
import { AppError } from "@shared/errors/AppError";

import { SendForgotPasswordMailUseCase } from "./SendForgotPasswordMailUseCase";

let sendForgotPasswordMail: SendForgotPasswordMailUseCase;
let usersRepository: UsersRepositoryMock;
let userTokensRepository: UserTokensRepositoryMock;
let dateProvider: DayjsDateProvider;
let mailProvider: MailProviderMock;

describe("SendForgotPasswordMailUseCase", () => {
  beforeEach(() => {
    usersRepository = new UsersRepositoryMock();
    userTokensRepository = new UserTokensRepositoryMock();
    dateProvider = new DayjsDateProvider();
    mailProvider = new MailProviderMock();
    sendForgotPasswordMail = new SendForgotPasswordMailUseCase(
      usersRepository,
      userTokensRepository,
      dateProvider,
      mailProvider
    );
  });

  it("should be able to send mail to a user", async () => {
    const sendMail = spyOn(mailProvider, "sendMail");

    await usersRepository.create({
      name: "teste",
      email: "teste@email.com",
      password: "12345",
      driver_license: "1111",
    });

    await sendForgotPasswordMail.execute("teste@email.com");

    expect(sendMail).toHaveBeenCalled();
  });

  it("should be able to create a token", async () => {
    const createToken = spyOn(userTokensRepository, "create");

    await usersRepository.create({
      name: "teste",
      email: "teste@email.com",
      password: "12345",
      driver_license: "1111",
    });

    await sendForgotPasswordMail.execute("teste@email.com");

    expect(createToken).toHaveBeenCalled();
  });

  it("should not be able to send a mail to a non-existent user", async () => {
    await expect(
      sendForgotPasswordMail.execute("fake-mail")
    ).rejects.toBeInstanceOf(AppError);
  });
});
