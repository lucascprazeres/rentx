import { getRepository, Repository } from "typeorm";

import { ICreateUserDTO } from "@modules/accounts/dtos/ICreateUserDTO";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";

import { User } from "../entities/User";

export class UsersRepository implements IUsersRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = getRepository(User);
  }

  async findByEmail(email: string): Promise<User> {
    return this.repository.findOne({ email });
  }

  async findById(id: string): Promise<User> {
    return this.repository.findOne(id);
  }

  async findByDriverLicense(driver_license: string): Promise<User> {
    return this.repository.findOne({ driver_license });
  }

  async create({
    id,
    avatar,
    name,
    email,
    password,
    driver_license,
  }: ICreateUserDTO): Promise<void> {
    const user = this.repository.create({
      id,
      avatar,
      name,
      email,
      password,
      driver_license,
    });

    await this.repository.save(user);
  }
}
