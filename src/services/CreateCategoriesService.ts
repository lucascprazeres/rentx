import { CategoriesRepository } from "../repositories/CategoriesRepository";

interface IRequest {
  name: string;
  description: string;
}

export class CreateCategorieService {
  constructor(private categoriesRepository: CategoriesRepository) {}

  async execute({ name, description }: IRequest): Promise<void> {
    const foundCategory = await this.categoriesRepository.findByName(name);

    if (foundCategory) {
      throw new Error("Category already exists.");
    }

    await this.categoriesRepository.create({ name, description });
  }
}
