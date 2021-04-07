import { inject, injectable } from "tsyringe";

import { deleteFile } from "@utils/file";

import { IUpdateUserAvatarDTO } from "../../dtos/IUpdateUserAvatarDTO";
import { IUsersRepository } from "../../repositories/IUsersRepository";

@injectable()
export class UpdateUserAvatarUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository
  ) {}

  async execute({ user_id, avatar_file }: IUpdateUserAvatarDTO): Promise<void> {
    const updatedUser = await this.usersRepository.findById(user_id);

    if (updatedUser.avatar) {
      await deleteFile(`./tmp/avatar/${updatedUser.avatar}`);
    }
    updatedUser.avatar = avatar_file;

    await this.usersRepository.create(updatedUser);
  }
}
