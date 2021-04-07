import { Category } from "../infra/typeorm/entities/Category";

export interface ICreateCategoryDTO {
  name: string;
  description: string;
}

export interface ICategoriesRepository {
  findByName(name: string): Promise<Category | undefined>;
  all(): Promise<Category[]>;
  create(data: ICreateCategoryDTO): Promise<void>;
}
