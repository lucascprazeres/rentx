import { getRepository, Repository } from "typeorm";

import { ICreateUserTokenDTO } from "@modules/accounts/dtos/ICreateUserTokenDTO";
import { IFindByUserIdAndTokenDTO } from "@modules/accounts/dtos/IFindByUserIdAndTokenDTO";
import { IUserTokensRepository } from "@modules/accounts/repositories/IUserTokenRespository";

import { UserToken } from "../entities/UserToken";

class UserTokensRepository implements IUserTokensRepository {
  private repository: Repository<UserToken>;

  constructor() {
    this.repository = getRepository(UserToken);
  }

  async create({
    user_id,
    expires_in,
    refresh_token,
  }: ICreateUserTokenDTO): Promise<UserToken> {
    const userToken = this.repository.create({
      user_id,
      expires_in,
      refresh_token,
    });

    await this.repository.save(userToken);

    return userToken;
  }

  async findByUserIdAndToken({
    user_id,
    refresh_token,
  }: IFindByUserIdAndTokenDTO): Promise<UserToken> {
    return this.repository.findOne({
      user_id,
      refresh_token,
    });
  }

  async deleteById(token_id: string): Promise<void> {
    await this.repository.delete(token_id);
  }
}

export { UserTokensRepository };
