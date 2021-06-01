import { UsersRepositoryMock } from "@modules/accounts/repositories/mocks/UsersRepositoryMock";
import { UserTokensRepositoryMock } from "@modules/accounts/repositories/mocks/UserTokensRepositoryMock";
import { DayjsDateProvider } from "@shared/container/providers/DateProvider/implementations/DayjsDateProvider";
import { AppError } from "@shared/errors/AppError";

import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";

let usersRepository: UsersRepositoryMock;
let userTokensRepository: UserTokensRepositoryMock;
let dateProvider: DayjsDateProvider;
let createUser: CreateUserUseCase;
let authenticateUser: AuthenticateUserUseCase;

describe("AuthenticateUserUseCase", () => {
  beforeEach(() => {
    usersRepository = new UsersRepositoryMock();
    userTokensRepository = new UserTokensRepositoryMock();
    dateProvider = new DayjsDateProvider();
    createUser = new CreateUserUseCase(usersRepository);
    authenticateUser = new AuthenticateUserUseCase(
      usersRepository,
      userTokensRepository,
      dateProvider
    );
  });

  it("should be able to authenticate a user", async () => {
    const user = {
      name: "John Doe",
      email: "johndoe@email.com",
      password: "123456",
      driver_license: "654321",
    };

    await createUser.execute(user);

    const authResult = await authenticateUser.execute({
      email: user.email,
      password: user.password,
    });

    expect(authResult.token).toBeTruthy();
    expect(authResult.user).toEqual(
      expect.objectContaining({
        name: user.name,
        email: user.email,
      })
    );
  });

  it("it should not be able to authenticate a non-existent user", async () => {
    await expect(
      authenticateUser.execute({
        email: "fake@email.com",
        password: "fakepassword",
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should be able to authenticate a user with wrong password", async () => {
    const user = {
      name: "John Doe",
      email: "johndoe@email.com",
      password: "123456",
      driver_license: "654321",
    };

    await createUser.execute(user);

    await expect(
      authenticateUser.execute({
        email: user.email,
        password: "wrong-pasword",
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
