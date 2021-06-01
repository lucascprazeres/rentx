import { ICreateUserTokenDTO } from "../dtos/ICreateUserTokenDTO";
import { IFindByUserIdAndTokenDTO } from "../dtos/IFindByUserIdAndTokenDTO";
import { UserToken } from "../infra/typeorm/entities/UserToken";

interface IUserTokensRepository {
  create(data: ICreateUserTokenDTO): Promise<UserToken>;
  findByUserIdAndToken(data: IFindByUserIdAndTokenDTO): Promise<UserToken>;
  deleteById(token_id: string): Promise<void>;
  findByRefreshToken(refresh_token: string): Promise<UserToken>;
}

export { IUserTokensRepository };
