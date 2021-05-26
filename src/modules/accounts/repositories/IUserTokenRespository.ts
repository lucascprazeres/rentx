import { ICreateUserTokenDTO } from "../dtos/ICreateUserTokenDTO";
import { UserToken } from "../infra/typeorm/entities/UserToken";

interface IUserTokensRepository {
  create(data: ICreateUserTokenDTO): Promise<UserToken>;
}

export { IUserTokensRepository };
