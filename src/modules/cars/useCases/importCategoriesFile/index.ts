import { CategoriesRepository } from "../../repositories/implementations/CategoriesRepository";
import { ImportCategoriesFileController } from "./ImportCategoriesfileController";
import { ImportCategoriesFileUseCase } from "./ImportCategoriesFileUseCase";

export default (): ImportCategoriesFileController => {
  const categoriesRepository = new CategoriesRepository();
  const importCategoriesFileUseCase = new ImportCategoriesFileUseCase(
    categoriesRepository
  );
  const importCategoriesFileController = new ImportCategoriesFileController(
    importCategoriesFileUseCase
  );

  return importCategoriesFileController;
};
