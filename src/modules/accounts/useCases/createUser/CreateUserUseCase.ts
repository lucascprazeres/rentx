import { hash } from "bcryptjs";
import { inject, injectable } from "tsyringe";

import { ICreateUserDTO } from "@modules/accounts/dtos/ICreateUserDTO";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { AppError } from "@shared/errors/AppError";

@injectable()
export class CreateUserUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository
  ) {}

  async execute({
    name,
    email,
    password,
    driver_license,
  }: ICreateUserDTO): Promise<void> {
    const foundUserByEmail = await this.usersRepository.findByEmail(email);

    if (foundUserByEmail) {
      throw new AppError("Email is already in use.");
    }

    const foundUserByDriverLicense = await this.usersRepository.findByDriverLicense(
      driver_license
    );

    if (foundUserByDriverLicense) {
      throw new AppError("Driver license is already in use.");
    }

    const passwordHash = await hash(password, 8);

    await this.usersRepository.create({
      name,
      email,
      password: passwordHash,
      driver_license,
    });
  }
}
