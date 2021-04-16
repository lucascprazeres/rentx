import { Category } from "@modules/cars/infra/typeorm/entities/Category";

import {
  ICategoriesRepository,
  ICreateCategoryDTO,
} from "../ICategoriesRepository";

export class CategoriesRepositoryMock implements ICategoriesRepository {
  private categories: Category[];

  constructor() {
    this.categories = [];
  }

  async findByName(name: string): Promise<Category | undefined> {
    return this.categories.find((category) => category.name === name);
  }
  async all(): Promise<Category[]> {
    return this.categories;
  }
  async create({ name, description }: ICreateCategoryDTO): Promise<void> {
    const category = new Category();

    Object.assign(category, {
      name,
      description,
      created_at: new Date(),
    });

    this.categories.push(category);
  }
}
