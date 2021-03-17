import { Category } from "../models/Category";

export interface ICreateCategoryDTO {
  name: string;
  description: string;
}

export interface ICategoriesRepository {
  findByName(name: string): Promise<Category>;
  all(): Promise<Category[]>;
  create(data: ICreateCategoryDTO): Promise<void>;
}
