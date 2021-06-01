import { ICreateUserTokenDTO } from "@modules/accounts/dtos/ICreateUserTokenDTO";
import { IFindByUserIdAndTokenDTO } from "@modules/accounts/dtos/IFindByUserIdAndTokenDTO";
import { UserToken } from "@modules/accounts/infra/typeorm/entities/UserToken";

import { IUserTokensRepository } from "../IUserTokenRespository";

class UserTokensRepositoryMock implements IUserTokensRepository {
  private userTokens: UserToken[];

  constructor() {
    this.userTokens = [];
  }

  async create({
    expires_in,
    refresh_token,
    user_id,
  }: ICreateUserTokenDTO): Promise<UserToken> {
    const userToken = new UserToken();
    Object.assign(userToken, {
      expires_in,
      refresh_token,
      user_id,
    });

    this.userTokens.push(userToken);

    return userToken;
  }

  async findByUserIdAndToken({
    user_id,
    refresh_token,
  }: IFindByUserIdAndTokenDTO): Promise<UserToken> {
    return this.userTokens.find(
      (token) =>
        token.user_id === user_id && token.refresh_token === refresh_token
    );
  }

  async deleteById(token_id: string): Promise<void> {
    const deletedTokenIndex = this.userTokens.findIndex(
      (token) => token.id === token_id
    );

    this.userTokens.splice(deletedTokenIndex, 1);
  }

  async findByRefreshToken(refresh_token: string): Promise<UserToken> {
    return this.userTokens.find(
      (token) => token.refresh_token === refresh_token
    );
  }
}

export { UserTokensRepositoryMock };
