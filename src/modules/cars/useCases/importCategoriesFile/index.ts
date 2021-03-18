import { CategoriesRepository } from "../../repositories/implementations/CategoriesRepository";
import { ImportCategoriesFileController } from "./ImportCategoriesfileController";
import { ImportCategoriesFileUseCase } from "./ImportCategoriesFileUseCase";

const categoriesRepository = CategoriesRepository.getInstance();
const importCategoriesFileUseCase = new ImportCategoriesFileUseCase(
  categoriesRepository
);
const importCategoriesFileController = new ImportCategoriesFileController(
  importCategoriesFileUseCase
);

export { importCategoriesFileController };
