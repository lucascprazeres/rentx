import { UsersRepositoryMock } from "@modules/accounts/repositories/mocks/UsersRepositoryMock";
import { AppError } from "@shared/errors/AppError";

import { UpdateUserAvatarUseCase } from "./UpdateUserAvatarUseCase";

let usersRepository: UsersRepositoryMock;
let updateUserAvatar: UpdateUserAvatarUseCase;

describe("CreateUserUseCase", () => {
  beforeEach(() => {
    usersRepository = new UsersRepositoryMock();
    updateUserAvatar = new UpdateUserAvatarUseCase(usersRepository);
  });

  it("should be able to update a users avatar", async () => {
    await usersRepository.create({
      name: "teste",
      email: "teste@email.com",
      password: "12345",
      driver_license: "1111",
    });

    const { id: user_id } = await usersRepository.findByDriverLicense("1111");

    await updateUserAvatar.execute({
      user_id,
      avatar_file: "file.png",
    });

    const user = await usersRepository.findByDriverLicense("1111");

    expect(user.avatar).toBe("file.png");
  });

  it("should not be able to update a non-existent users avatar", async () => {
    await expect(
      updateUserAvatar.execute({
        user_id: "fake_id",
        avatar_file: "file.png",
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
