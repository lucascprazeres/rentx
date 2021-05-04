import { UsersRepositoryMock } from "@modules/accounts/repositories/mocks/UsersRepositoryMock";
import { AppError } from "@shared/errors/AppError";

import { CreateUserUseCase } from "./CreateUserUseCase";

let usersRepository: UsersRepositoryMock;
let createUser: CreateUserUseCase;

describe("CreateUserUseCase", () => {
  beforeEach(() => {
    usersRepository = new UsersRepositoryMock();
    createUser = new CreateUserUseCase(usersRepository);
  });

  it("should be able to create a new user", async () => {
    await createUser.execute({
      name: "teste",
      email: "teste@email.com",
      password: "12345",
      driver_license: "1111",
    });

    const user = await usersRepository.findByEmail("teste@email.com");

    expect(user).toHaveProperty("id");
    expect(user).toHaveProperty("avatar");
    expect(user.admin).toBe(false);
    expect(user).toEqual(
      expect.objectContaining({
        name: "teste",
        email: "teste@email.com",
        driver_license: "1111",
      })
    );
  });

  it("should not be able to create more than one user with a given email", async () => {
    await createUser.execute({
      name: "teste",
      email: "teste@email.com",
      password: "12345",
      driver_license: "1111",
    });

    await expect(
      createUser.execute({
        name: "teste",
        email: "teste@email.com",
        password: "12345",
        driver_license: "2222",
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to create more than one user with a given driver_license", async () => {
    await createUser.execute({
      name: "teste",
      email: "teste@email.com",
      password: "12345",
      driver_license: "1111",
    });

    await expect(
      createUser.execute({
        name: "teste",
        email: "outro@email.com",
        password: "12345",
        driver_license: "1111",
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
