import { Repository, getRepository } from "typeorm";

import { Category } from "../../entities/Category";
import {
  ICategoriesRepository,
  ICreateCategoryDTO,
} from "../ICategoriesRepository";

export class CategoriesRepository implements ICategoriesRepository {
  private repository: Repository<Category>;

  constructor() {
    this.repository = getRepository(Category);
  }

  async all(): Promise<Category[]> {
    return this.repository.find();
  }

  async findByName(name: string): Promise<Category | undefined> {
    return this.repository.findOne({ name });
  }

  async create({ name, description }: ICreateCategoryDTO): Promise<void> {
    const category = this.repository.create({
      name,
      description,
    });

    await this.repository.save(category);
  }
}
