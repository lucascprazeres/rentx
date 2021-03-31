import { inject, injectable } from "tsyringe";

import { AppError } from "../../../../errors/AppError";
import {
  ICategoriesRepository,
  ICreateCategoryDTO,
} from "../../repositories/ICategoriesRepository";

@injectable()
export class CreateCategoryUseCase {
  constructor(
    @inject("CategoriesRepository")
    private categoriesRepository: ICategoriesRepository
  ) {}

  async execute({ name, description }: ICreateCategoryDTO): Promise<void> {
    const foundCategory = await this.categoriesRepository.findByName(name);

    if (foundCategory) {
      throw new AppError("Category already exists.");
    }

    await this.categoriesRepository.create({ name, description });
  }
}
