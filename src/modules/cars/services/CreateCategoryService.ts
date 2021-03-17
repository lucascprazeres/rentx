import {
  ICategoriesRepository,
  ICreateCategoryDTO,
} from "../repositories/ICategoriesRepository";

export class CreateCategoryService {
  constructor(private categoriesRepository: ICategoriesRepository) {}

  async execute({ name, description }: ICreateCategoryDTO): Promise<void> {
    const foundCategory = await this.categoriesRepository.findByName(name);

    if (foundCategory) {
      throw new Error("Category already exists.");
    }

    await this.categoriesRepository.create({ name, description });
  }
}
